// Sample data for the demo. Prices are placeholders.
const BRAND = { name: "الحاجة", whatsapp: "201095571138", shipping: 70 };

const COLLECTIONS = {
  bridal: { ar: "إسدالات العرايس", en: "Bridal Esdals", num: "I" },
  reception: { ar: "عبايات الاستقبال", en: "Reception Abayas", num: "II" },
  daily: { ar: "إسدالات يومية", en: "Everyday Esdals", num: "III" }
};

const FABRICS = [
  { id: "satin", ar: "ساتان", img: "fab2" },
  { id: "crepe", ar: "كريب", img: "fab1" },
  { id: "chiffon", ar: "شيفون", img: "fab3" }
];

const LENGTHS = ["140", "150", "160", "170"];

const PRODUCTS = [
  { id: "a1", col: "bridal", name: "إسدال العروسة اللؤلؤي", img: "p_bride_white", price: 2850, colors: [["أبيض لؤلؤي", "#f4efe6"], ["عاجي", "#ece1cc"]], tag: "الأكثر طلباً" },
  { id: "a2", col: "bridal", name: "إسدال الدانتيل الملكي", img: "p_bride_lace", price: 3200, colors: [["أبيض", "#f7f4ee"], ["شامبين", "#e7d3b0"]], tag: "جديد" },
  { id: "a3", col: "bridal", name: "إسدال ساتان بطرحة", img: "p_bride_satin", price: 2650, colors: [["أبيض", "#f5f1ea"], ["بلاش", "#efd9d3"]] },
  { id: "a4", col: "bridal", name: "إسدال الحِنّة المطرّز", img: "p_recep_beige", price: 2950, colors: [["بيج ذهبي", "#d9c19a"], ["نود", "#e4cdb4"]] },
  { id: "a5", col: "bridal", name: "طقم الاستقبال الذهبي", img: "p_recep_gold", price: 3400, colors: [["ذهبي", "#cfae72"]], tag: "قطعة مميزة" },
  { id: "r1", col: "reception", name: "عباية استقبال بتطريز ذهبي", img: "p_abaya_gold", price: 1950, colors: [["أسود", "#1d1b19"], ["كحلي", "#232a44"]] },
  { id: "r2", col: "reception", name: "عباية سوداء مطرزة بالكامل", img: "p_abaya_emb", price: 2250, colors: [["أسود", "#1a1918"]], tag: "جديد" },
  { id: "r3", col: "reception", name: "عباية ساتان كحلي", img: "p_abaya_navy", price: 1750, colors: [["كحلي", "#2b2d5c"], ["موف", "#5a3d6b"]] },
  { id: "r4", col: "reception", name: "عباية استقبال باستيل", img: "p_recep_pastel", price: 1650, colors: [["زيتي فاتح", "#a9b49a"], ["بني فاتح", "#b08a6e"]] },
  { id: "r5", col: "reception", name: "عباية خضراء بتطريز فضي", img: "p_recep_green", price: 2100, colors: [["زيتوني", "#5b6b4a"]] },
  { id: "r6", col: "reception", name: "عباية ساتان رملي", img: "p_recep_satin", price: 1850, colors: [["رملي", "#d8c4a6"], ["كاكاو", "#8a6b55"]] },
  { id: "d1", col: "daily", name: "إسدال أسود بحواف بيضاء", img: "p_daily_trim", price: 950, colors: [["أسود", "#1b1a19"]] },
  { id: "d2", col: "daily", name: "إسدال رمادي ناعم", img: "p_daily_grey", price: 850, colors: [["رمادي", "#bdb7ae"], ["بيج", "#d9cbb5"]] },
  { id: "d3", col: "daily", name: "إسدال كلاسيك أسود", img: "p_daily_black", price: 890, colors: [["أسود", "#151413"]] },
  { id: "d4", col: "daily", name: "إسدال أبيض للصلاة", img: "p_daily_white", price: 820, colors: [["أبيض", "#f2efe9"]] },
  { id: "d5", col: "daily", name: "إسدال مقلّم مريح", img: "p_daily_stripe", price: 780, colors: [["مقلم بني", "#9c6b45"]] }
];

// Size advisor: by height (cm) -> length
function recommendLength(h, w) {
  let l = h < 150 ? "140" : h < 160 ? "150" : h < 170 ? "160" : "170";
  const width = w < 60 ? "S" : w < 72 ? "M" : w < 85 ? "L" : "XL";
  return { length: l, width };
}
