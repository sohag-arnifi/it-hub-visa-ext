export const centers = [
  { id: 1, c_name: "Dhaka" },
  { id: 2, c_name: "Chittagong" },
  { id: 3, c_name: "Rajshahi" },
  { id: 4, c_name: "Sylhet" },
  { id: 5, c_name: "Khulna" },
];

export const ivacs = [
  {
    id: 2,
    center_info_id: 3,
    ivac_name: "IVAC , RAJSHAHI",
  },
  {
    id: 3,
    center_info_id: 5,
    ivac_name: "IVAC, KHULNA",
  },
  {
    id: 4,
    center_info_id: 4,
    ivac_name: "IVAC, SYLHET",
  },
  {
    id: 5,
    center_info_id: 2,
    ivac_name: "IVAC, CHITTAGONG",
  },
  {
    id: 7,
    center_info_id: 3,
    ivac_name: "IVAC, RANGPUR",
  },
  {
    id: 8,
    center_info_id: 4,
    ivac_name: "IVAC, MYMENSINGH",
  },
  {
    id: 9,
    center_info_id: 1,
    ivac_name: "IVAC, BARISAL",
  },
  {
    id: 12,
    center_info_id: 1,
    ivac_name: "IVAC, JESSORE",
  },
  {
    id: 17,
    center_info_id: 1,
    ivac_name: "IVAC, Dhaka (JFP)",
  },
  {
    id: 18,
    center_info_id: 3,
    ivac_name: "IVAC, THAKURGAON",
  },
  {
    id: 19,
    center_info_id: 3,
    ivac_name: "IVAC, BOGURA",
  },
  {
    id: 20,
    center_info_id: 1,
    ivac_name: "IVAC, SATKHIRA",
  },
  {
    id: 21,
    center_info_id: 2,
    ivac_name: "IVAC, CUMILLA",
  },
  {
    id: 22,
    center_info_id: 2,
    ivac_name: "IVAC, NOAKHALI",
  },
  {
    id: 23,
    center_info_id: 2,
    ivac_name: "IVAC, BRAHMANBARIA",
  },
  {
    id: 24,
    center_info_id: 3,
    ivac_name: "IVAC, KUSHTIA",
  },
];

export const visaTypes = [
  { id: 3, type_name: "TOURIST VISA" },
  { id: 13, type_name: "MEDICAL/MEDICAL ATTENDANT VISA" },
  { id: 1, type_name: "BUSINESS VISA" },
  { id: 6, type_name: "ENTRY VISA" },
  { id: 2, type_name: "STUDENT VISA" },
];

[{}];

export const paymentMethod = [
  {
    name: "DBBL MOBILE BANKING",
    slug: "dbblmobilebanking",
  },
  {
    name: "Bkash",
    slug: "bkash",
  },
  {
    name: "MYCASH",
    slug: "mycash",
  },
  {
    name: "Nagad",
    slug: "nagad",
  },
  {
    name: "Mobile Money",
    slug: "mobilemoney",
  },
  {
    name: "Okwallet",
    slug: "okwallet",
  },
];

export const getCenter = (id) => {
  return centers.find((center) => center.id === id);
};

export const getIVAC = (id) => {
  return ivacs.find((ivac) => ivac.id === id);
};

export const getVisaType = (id) => {
  return visaTypes.find((visaType) => visaType.id === id);
};

export const getPaymentMethod = (slug) => {
  return paymentMethod.find((option) => option?.slug === slug);
};
