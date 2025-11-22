import { useState } from 'react';

// 커피 이미지 컴포넌트
function CoffeeImage({ name, image }) {
  const [imageError, setImageError] = useState(false);

  // 이미지 경로 처리 함수
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 상대 경로인 경우 프론트엔드 public 폴더에서 제공
    // 배포 환경에서는 /로 시작하는 경로가 프론트엔드 도메인을 기준으로 함
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // 파일명만 있는 경우 public 폴더에서 찾기
    return `/${imagePath}`;
  };

  const imageUrl = getImageUrl(image);

  // 이미지 경로가 있고 에러가 없으면 실제 이미지 표시
  if (imageUrl && !imageError) {
    return (
      <div className="coffee-image-container">
        <img 
          src={imageUrl} 
          alt={name}
          className="coffee-image"
          onError={() => {
            console.warn(`이미지 로드 실패: ${imageUrl} (원본 경로: ${image})`);
            setImageError(true);
          }}
        />
      </div>
    );
  }

  // 이미지가 없거나 에러가 발생하면 SVG 표시
  return (
    <div className="coffee-image-container">
      {renderSVG(name)}
    </div>
  );
}

function renderSVG(name) {
  const getCoffeeColor = (name) => {
    const colors = {
      '아메리카노': '#6F4E37',
      '카페라떼': '#D4A574',
      '카푸치노': '#E6D3B3',
      '카라멜 마키아토': '#D2691E',
      '바닐라라떼': '#F5DEB3',
      '헤이즐넛라떼': '#8B4513',
      '에스프레소': '#3E2723',
      '콜드브루': '#5D4037',
      '카페모카': '#4A2C2A',
      '아이스 아메리카노': '#87CEEB',
      '아이스 카페라떼': '#B0E0E6',
      '플랫화이트': '#F0E68C'
    };
    return colors[name] || '#6F4E37';
  };

  const isIced = name.includes('아이스');

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="coffee-svg">
        {/* 컵 */}
        <ellipse cx="60" cy="100" rx="35" ry="8" fill="#E0E0E0" />
        <path d="M 25 100 Q 25 60 30 40 Q 35 20 60 20 Q 85 20 90 40 Q 95 60 95 100" 
              fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="2" />
        
        {/* 커피 액체 */}
        {isIced ? (
          <>
            {/* 얼음 */}
            <circle cx="50" cy="50" r="8" fill="#E0F2F7" opacity="0.7" />
            <circle cx="70" cy="55" r="6" fill="#E0F2F7" opacity="0.7" />
            <circle cx="60" cy="65" r="7" fill="#E0F2F7" opacity="0.7" />
            {/* 아이스 커피 */}
            <path d="M 30 60 Q 30 50 35 45 Q 40 40 60 40 Q 80 40 85 45 Q 90 50 90 60" 
                  fill={getCoffeeColor(name)} opacity="0.6" />
          </>
        ) : (
          <>
            {/* 커피 액체 */}
            <path d="M 30 60 Q 30 50 35 45 Q 40 40 60 40 Q 80 40 85 45 Q 90 50 90 60" 
                  fill={getCoffeeColor(name)} />
            
            {/* 거품 (라떼, 카푸치노 등) */}
            {name.includes('라떼') || name.includes('카푸치노') || name.includes('플랫') ? (
              <>
                <circle cx="50" cy="45" r="5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="60" cy="42" r="6" fill="#FFFFFF" opacity="0.9" />
                <circle cx="70" cy="45" r="5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="55" cy="48" r="4" fill="#FFFFFF" opacity="0.8" />
                <circle cx="65" cy="48" r="4" fill="#FFFFFF" opacity="0.8" />
              </>
            ) : null}
            
            {/* 카라멜/시럽 (카라멜 마키아토, 바닐라라떼 등) */}
            {name.includes('카라멜') || name.includes('바닐라') || name.includes('헤이즐넛') ? (
              <path d="M 35 50 Q 40 48 45 47 Q 50 46 60 46 Q 70 46 75 47 Q 80 48 85 50" 
                    fill="#D2691E" opacity="0.7" stroke="#8B4513" strokeWidth="1" />
            ) : null}
            
            {/* 초콜릿 (카페모카) */}
            {name.includes('모카') ? (
              <>
                <path d="M 35 50 Q 40 48 45 47 Q 50 46 60 46 Q 70 46 75 47 Q 80 48 85 50" 
                      fill="#4A2C2A" opacity="0.8" />
                <circle cx="60" cy="48" r="3" fill="#8B4513" />
              </>
            ) : null}
          </>
        )}
        
        {/* 증기 (핫 커피만) */}
        {!isIced && !name.includes('콜드브루') && (
          <>
            <path d="M 45 15 Q 48 10 50 5" stroke="#CCCCCC" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 60 15 Q 62 10 65 5" stroke="#CCCCCC" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 75 15 Q 72 10 70 5" stroke="#CCCCCC" strokeWidth="2" fill="none" opacity="0.6" />
          </>
        )}
      </svg>
  );
}

export default CoffeeImage;

