export class MallDto {
  category: string;
  countryCode: string;
  logoUrl: string;
  title: string;
  description: string;
  url: string;
}

export const malls: MallDto[] = [
  {
    category: '전체',
    countryCode: 'US',
    logoUrl:
      'http://wiki.hash.kr/images/f/f3/%EC%95%84%EB%A7%88%EC%A1%B4_%EB%A1%9C%EA%B3%A0.png',
    title: '전세계적인 최고 쇼핑몰',
    description: '아마존 미국(Amazon US)',
    url: 'https://www.amazon.com',
  },
  {
    category: '전체',
    countryCode: 'US',
    logoUrl: 'https://static.itrcomm.com/img/common/ebaysh_icon.jpg',
    title: '다양한 신상품, 중고품 판매 쇼핑몰',
    description: '이베이(ebay)',
    url: 'https://www.ebay.com',
  },
  {
    category: '전체',
    countryCode: 'US',
    logoUrl:
      'https://img.etnews.com/photonews/1505/684882_20150514113340_656_0001.jpg',
    title: '미국 할인점의 대명사',
    description: '월마트(Walmart)',
    url: 'https://www.walmart.com',
  },
  {
    category: '전체',
    countryCode: 'CN',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c4/JD.com_logo.png',
    title: '정품인증, 빠른배송! 중국의 쿠팡',
    description: '징동닷컴(JD.com)',
    url: 'https://global.jd.com',
  },
  {
    category: '전자제품',
    countryCode: 'CN',
    logoUrl:
      'https://customercarecontacts.com/wp-content/uploads/2018/07/GOME-logo-300x181.jpg',
    title: '전자제품 전문, 중국의 하이마트',
    description: '궈머이(gome)',
    url: 'https://www.gome.com.cn',
  },
  {
    category: '전체',
    countryCode: 'CN',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c7/Dangdang_logo.png',
    title: '중국판 아마존',
    description: '당당왕(dangdang)',
    url: 'http://www.dangdang.com',
  },
  {
    category: '전체',
    countryCode: 'JP',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rakuten_Global_Brand_Logo.svg/320px-Rakuten_Global_Brand_Logo.svg.png',
    title: '일본 대표 오픈마켓',
    description: '라쿠텐(Rakuten)',
    url: 'https://www.rakuten.co.jp',
  },
  {
    category: '전체',
    countryCode: 'JP',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Amazon.co.jp_logo.svg/300px-Amazon.co.jp_logo.svg.png',
    title: '일본 1위 쇼핑몰',
    description: '아마존 재팬(Amazon/JP)',
    url: 'https://www.amazon.co.jp',
  },
  {
    category: '전체',
    countryCode: 'JP',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Yahoo_Japan_Logo.svg/320px-Yahoo_Japan_Logo.svg.png',
    title: '일본판 네이버 지식쇼핑',
    description: '야후쇼핑(Yahoo!Japan)',
    url: 'https://shopping.yahoo.co.jp',
  },
  {
    category: '전자제품',
    countryCode: 'US',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/320px-Best_Buy_Logo.svg.png',
    title: '전자제품 및 컴퓨터 종합몰',
    description: '베스트 바이(BestBuy)',
    url: '',
  },
];
