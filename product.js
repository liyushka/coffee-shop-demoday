
const productsData = [
    {
        id: 1,
        category: "hot",
        featured: true,
        price: 28000,
        img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Espresso Craft Cappuccino", ru: "Классический Капучино", en: "Craft Cappuccino" },
        desc: { uz: "Natijali 100% Arabica va ko'pirtirilgan sut", ru: "Свежая арабика и пышная молочная пенка", en: "Double specialty espresso with microfoam" }
    },
    {
        id: 2,
        category: "hot",
        featured: true,
        price: 32000,
        img: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Flat White Specialty", ru: "Флэт Уайт Спешелти", en: "Flat White Specialty" },
        desc: { uz: "Ikkilangan espresso va ipakdek mayin sut", ru: "Двойной эспрессо с бархатистой структурой", en: "Double ristretto with silky microfoam" }
    },
    {
        id: 3,
        category: "signature",
        featured: true,
        price: 35000,
        img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Karamel Raf Mualliflik", ru: "Карамельный Раф", en: "Signature Caramel Raf" },
        desc: { uz: "Tabiiy karamel va vanil bilan tayyorlangan raf", ru: "Нежный раф с натуральной карамелью", en: "Creamy espresso blended with real caramel" }
    },
    {
        id: 4,
        category: "iced",
        featured: false,
        price: 26000,
        img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Muzli Americano", ru: "Айс Американо", en: "Iced Americano" },
        desc: { uz: "Muz va toza suv bilan tetiklashtiruvchi espresso", ru: "Освежающий эспрессо со льдом", en: "Chilled espresso over ice" }
    },
    {
        id: 5,
        category: "iced",
        featured: false,
        price: 34000,
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Bumble Coffee (Apelsin)", ru: "Бамбл Кофе", en: "Bumble Coffee (Orange)" },
        desc: { uz: "Yangi siqilgan apelsin sharbati va espresso", ru: "Свежевыжатый апельсиновый сок и эспрессо", en: "Fresh orange juice layered with double espresso" }
    },
    {
        id: 6,
        category: "tea",
        featured: true,
        price: 36000,
        img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Yapon Matcha Latte", ru: "Японский Матча Латте", en: "Japanese Matcha Latte" },
        desc: { uz: "Uji premium yashil matcha choyi va sut", ru: "Премиальный зеленый матч из Удзи", en: "Authentic Uji ceremonial matcha with milk" }
    },
    {
        id: 7,
        category: "desserts",
        featured: false,
        price: 32000,
        img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80",
        name: { uz: "San Sebastian Tiramisu", ru: "Сан-Себастьян Тирамису", en: "San Sebastian Tiramisu" },
        desc: { uz: "Pishloqli mayin kremli klassik dessert", ru: "Нежнейший итальянский десерт", en: "Traditional mascarpone tiramisu" }
    },
    {
        id: 8,
        category: "bakery",
        featured: true,
        price: 22000,
        img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Fransuz Sariyog'li Kruassan", ru: "Французский Круассан", en: "Butter French Croissant" },
        desc: { uz: "Har kuni pishiriladigan qat-qat kruassan", ru: "Свежевыпеченный слоеный круассан", en: "Flaky fresh butter croissant" }
    },
    {
        id: 9,
        category: "bakery",
        featured: false,
        price: 28000,
        img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
        name: { uz: "Shokoladli Muffins", ru: "Шоколадный Маффин", en: "Dark Chocolate Muffin" },
        desc: { uz: "Belgiya shokoladi bo'laklari bilan maffin", ru: "Маффин с бельгийским шоколадом", en: "Rich muffin filled with chocolate chunks" }
    }
];