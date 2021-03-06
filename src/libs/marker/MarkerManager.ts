import { nanoid } from "nanoid";
import head from "lodash/head";
import {
  KakaoCoord2Address,
  KakaoPlaceSearchResult,
  KakaoPlace,
} from "./types";
import { Marker } from "./Marker";
import { Line } from "./Line";

export class MarkerManager {
  // marker manager id
  private id: string;
  // 마커 정보를 mapping 값으로 저장
  private mappingMarker: Map<string, Marker>;
  // 전체 마커 정보
  private allMarkers: Marker[];
  // 전체 마커 정보 id 정보
  private allMarkerByIds: string[];
  // 마커가 한개가 생성 될 때 마다 증가하는 값 유니크 아이디값 생성 (증가만 있다)
  // 마커를 삭제해도 줄어들지 않음
  private totalMarkerSupply: number;
  // kakao 맵
  private map: kakao.maps.Map | null;

  constructor() {
    this.id = nanoid(10);

    this.map = null;
    this.allMarkers = [];
    this.allMarkerByIds = [];

    this.mappingMarker = new Map<string, Marker>();

    this.totalMarkerSupply = 0;
  }

  get kakaoMap() {
    return this.map;
  }

  get marker() {
    return this.mappingMarker;
  }

  get markers() {
    return this.allMarkers;
  }

  get markerIds() {
    return this.allMarkerByIds;
  }

  get totalMarkers() {
    return this.allMarkers.map((marker) => marker.toJSON());
  }

  destroy = () => {
    this.map = null;

    this.allMarkers.forEach((marker) => marker.destroy());

    this.allMarkers = [];
    this.allMarkerByIds = [];
    this.totalMarkerSupply = 0;
    this.mappingMarker.clear();
  };

  setKakaoMap = (map: kakao.maps.Map) => {
    this.map = map;
  };

  // 마커 등록
  registerMarker = async (latLng: kakao.maps.LatLng | null) => {
    if (!latLng) {
      const error = new Error();
      error.name = "maker manager validation";
      error.message = "latLng is null";
      return;
    }

    const lng = latLng.getLng();
    const lat = latLng.getLat();

    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise<any>((resolve) => {
      geocoder.coord2Address(lng, lat, async (result, status) => {
        const reuslt = await this.getCoord2Address(result, status, {
          latLng,
        });
        resolve(reuslt);
      });
    });
  };

  private getCoord2Address = async (
    result: KakaoCoord2Address[],
    status: kakao.maps.services.Status,
    { latLng }: { latLng: kakao.maps.LatLng }
  ) => {
    if (status !== kakao.maps.services.Status.OK) {
      const error = new Error();
      error.name = "geocoder service validation";
      error.message = "status is not OK";
      throw error;
    }

    const data = head(result);
    if (!data) {
      const error = new Error();
      error.name = "geocoder service validation";
      error.message = "data is null";
      throw error;
    }

    const {
      address: { address_name },
    } = data;

    const places = new kakao.maps.services.Places();
    return new Promise<any>((resolve) => {
      places.keywordSearch(address_name, async (result, status) => {
        const reuslt = await this.getSearch(result, status, {
          latLng,
          address: address_name,
        });
        resolve(reuslt);
      });
    });
  };

  private getSearch = async (
    result: KakaoPlaceSearchResult[],
    status: kakao.maps.services.Status,
    { latLng, address }: { latLng: kakao.maps.LatLng; address: string }
  ) => {
    const check = [
      kakao.maps.services.Status.OK,
      kakao.maps.services.Status.ZERO_RESULT,
    ];
    if (!check.includes(status)) {
      const error = new Error();
      error.name = "search service validation";
      error.message = "status is not OK";
      throw error;
    }
    if (!this.kakaoMap || !latLng) {
      const error = new Error();
      error.name = "search service validation";
      error.message = "kakaoMap or latLng is null";
      throw error;
    }

    const data = head(result);
    const marker = new Marker({
      map: this.kakaoMap,
      placeInfo: data ?? null,
      position: latLng,
      seq: this.allMarkers.length + 1,
      address: address,
      removeCallback: (data) => {
        this.mappingMarker.delete(data.markerId);
        this.allMarkers = this.allMarkers.filter(
          (instance) => instance.markerId !== data.markerId
        );
        this.allMarkerByIds = this.allMarkerByIds.filter(
          (id) => id !== data.markerId
        );
        console.log("remove allMarkerByIds", this.allMarkerByIds);
      },
    });
    // 이미 존재하는 아이디인지 체크.
    const validByMarkerId = this.allMarkerByIds.includes(marker.markerId);
    if (validByMarkerId) {
      const newMarkerId = `${nanoid(10)}${this.totalMarkerSupply}`;
      console.log(`reduplication => places(index: ${marker.markerId})`);
      marker.setMarkerId(newMarkerId);
    }

    // 생성한 마커를 캐시형태로 저장한다.
    this.mappingMarker.set(marker.markerId, marker);
    this.allMarkers.push(marker);
    this.allMarkerByIds.push(marker.markerId);
    this.totalMarkerSupply = this.totalMarkerSupply + 1;

    console.log("add allMarkerByIds", this.allMarkerByIds);

    Line.makeLine(this.kakaoMap, this.allMarkers);

    return marker;
  };

  makeMaker = ({
    place,
    latLng,
  }: {
    place: KakaoPlace;
    latLng: kakao.maps.LatLng;
  }) => {
    const marker = new Marker({
      map: this.kakaoMap!,
      placeInfo: {
        id: place.id,
        place_name: place.name ?? "",
        category_group_name: place.category ?? "",
        category_group_code: place.category_code ?? "",
        address_name: place.address_name,
        x: place.x,
        y: place.y,
        category_name: "",
        distance: "",
        phone: "",
        place_url: "",
        road_address_name: "",
      },
      position: latLng,
      seq: this.allMarkers.length + 1,
      address: place.address_name,
      removeCallback: (data) => {
        this.mappingMarker.delete(data.markerId);
        this.allMarkers = this.allMarkers.filter(
          (instance) => instance.markerId !== data.markerId
        );
        this.allMarkerByIds = this.allMarkerByIds.filter(
          (id) => id !== data.markerId
        );
        console.log("remove allMarkerByIds", this.allMarkerByIds);
      },
    });

    // 이미 존재하는 아이디인지 체크.
    const validByMarkerId = this.allMarkerByIds.includes(marker.markerId);
    if (validByMarkerId) {
      const newMarkerId = `${nanoid(10)}${this.totalMarkerSupply}`;
      console.log(`reduplication => places(index: ${marker.markerId})`);
      marker.setMarkerId(newMarkerId);
    }

    // 생성한 마커를 캐시형태로 저장한다.
    this.mappingMarker.set(marker.markerId, marker);
    this.allMarkers.push(marker);
    this.allMarkerByIds.push(marker.markerId);
    this.totalMarkerSupply = this.totalMarkerSupply + 1;

    console.log("add allMarkerByIds", this.allMarkerByIds);

    return marker;
  };
}
