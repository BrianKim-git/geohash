// Geohash 디코딩을 위한 base32 문자 집합
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export const encodeGeoHash = (lat: number, lng: number, hashLength: number) => {
    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    const binaryCordinate = getBinaryCordinate(lat, lng, hashLength);

    let geohash = '';
    for (let i = 0; i<hashLength; i++) {
        let start = 5 * i;
        let target = binaryCordinate.substring(start, start+5); 
        geohash += BASE32.charAt(parseInt(target, 2));
    }

    return geohash;
}

function getBinaryCordinate(lat: number, lng: number, hashLength: number) {
    let binary = '';
    let left = -180;
    let right = 180;
    let top = 90;
    let bottom = -90;

    const endCount = hashLength * 5;
    let count = 0;
    let verticalDivider;
    let horizontalDivider;

    while(true) {
        verticalDivider = (left + right) / 2;
        if (lng >= verticalDivider) {
            binary += '1';
            left = verticalDivider;
        } else {
            binary += '0';
            right = verticalDivider;
        }

        count++;

        if (count == endCount) {
            break;
        }

        horizontalDivider = (top + bottom) / 2;
        if (lat >= horizontalDivider) {
            binary += '1';
            bottom = horizontalDivider;
        } else {
            binary += '0';
            top = horizontalDivider;
        }

        count++;
        if (count == endCount) {
            break;
        }
    }
    return binary;
}



// Geohash를 EPSG:4326 좌표계 (경도, 위도)로 디코딩하는 함수
export const decodeGeohash = (geohash: string) => {
    let isEven = true;
    let lat = [-90.0, 90.0]; // 위도 범위
    let lon = [-180.0, 180.0]; // 경도 범위
    let latErr = 90.0;
    let lonErr = 180.0;

    for (let i = 0; i < geohash.length; i++) {
        const currentChar = geohash[i];
        const currentCharIndex = BASE32.indexOf(currentChar); // 문자 인덱스

        // 문자의 이진 표현을 계산
        for (let bit = 4; bit >= 0; bit--) {
            const mask = 1 << bit;

            if (isEven) {
                // 경도 계산
                lonErr /= 2;
                if ((currentCharIndex & mask) !== 0) {
                    lon[0] = (lon[0] + lon[1]) / 2; // 오른쪽 절반
                } else {
                    lon[1] = (lon[0] + lon[1]) / 2; // 왼쪽 절반
                }
            } else {
                // 위도 계산
                latErr /= 2;
                if ((currentCharIndex & mask) !== 0) {
                    lat[0] = (lat[0] + lat[1]) / 2; // 상위 절반
                } else {
                    lat[1] = (lat[0] + lat[1]) / 2; // 하위 절반
                }
            }
            isEven = !isEven;
        }
    }

    // 위도와 경도의 중간 값을 최종 좌표로 사용
    const finalLat = (lat[0] + lat[1]) / 2;
    const finalLon = (lon[0] + lon[1]) / 2;

    return {
        latitude: finalLat,
        longitude: finalLon
    };
}
