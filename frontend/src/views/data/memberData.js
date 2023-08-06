 const products = [
    {
        id: "1",
        name: "apple",
        post: "물류 담당자",
        pname: "짱구네 과일가게",
        priority: "배송 대기중",
        pbg: "primary.main",
        budget: "3.9",
    },
    {
        id: "2",
        name: "banana",
        post: "물류 담당자",
        pname: "유리네 과일가게",
        priority: "배송 중",
        pbg: "secondary.main",
        budget: "24.5",
    },
    {
        id: "3",
        name: "peach",
        post: "물류 담당자",
        pname: "훈이네 과일가게",
        priority: "발주 처리중",
        pbg: "error.main",
        budget: "12.8",
    },
    {
        id: "4",
        name: "purm",
        post: "물류 담당자",
        pname: "철수네 과일가게",
        priority: "입고 완료",
        pbg: "success.main",
        budget: "2.4",
    },
    {
        id: "5",
        name: "orange",
        post: "물류 담당자",
        pname: "영희네 과일가게",
        priority: "배송 대기중",
        pbg: "primary.main",
        budget: "8.2",
    },
    {
        id: "6",
        name: "grape",
        post: "물류 담당자",
        pname: "토마스네 과일가게",
        priority: "배송 중",
        pbg: "secondary.main",
        budget: "15.6",
    },
    // 나머지 데이터 36개
    {
        id: "7",
        name: "watermelon",
        post: "물류 담당자",
        pname: "박서준네 과일가게",
        priority: "배송 처리중",
        pbg: "primary.main",
        budget: "18.3",
    },
    {
        id: "8",
        name: "pineapple",
        post: "물류 담당자",
        pname: "김태리네 과일가게",
        priority: "입고 대기중",
        pbg: "secondary.main",
        budget: "9.7",
    },
    {
        id: "9",
        name: "kiwi",
        post: "물류 담당자",
        pname: "이지금네 과일가게",
        priority: "배송 처리중",
        pbg: "primary.main",
        budget: "6.5",
    },
    {
        id: "10",
        name: "mango",
        post: "물류 담당자",
        pname: "송강호네 과일가게",
        priority: "발주 대기중",
        pbg: "secondary.main",
        budget: "14.2",
    },
    // 이하 데이터 36개
    // ...
];
for (let i = 11; i <= 1000; i++) {
    const id = i.toString();
    const name = `fruit${i}`;
    const post = "물류 담당자";
    const pname = `과일가게${i}`;
    const priority = "입고 대기중";
    const pbg = "primary.main";
    const budget = 1000+i;
  
    products.push({ id, name, post, pname, priority, pbg, budget });
  }

  export default products;