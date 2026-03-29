export const providerNetwork = [
  {
    providerId: "PROV001",
    name: "Thyrocare Labs",
    type: "Lab",
    location: {
      address: "Viman Nagar, Pune",
      pincode: "411014",
      coordinates: { lat: 18.5679, lng: 73.9143 },
    },
    supportedProducts: ["Prime01", "Essential02", "Premium03"],
    rating: 4.2,
    reviews: 1250,
    contact: "+91-20-2605-7890",
    specialties: ["Pathology", "Preventive Health"],
    homeCollection: true,
    packages: [
      {
        packageId: "THY_FBC_001",
        name: "Full Body Checkup",
        price: 799,
        testsIncluded: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test"],
        tat: "24 hours",
        fasting: "8-12 hours",
        homeCollection: true,
      },
      {
        packageId: "THY_VIT_001",
        name: "Vitamin Panel",
        price: 899,
        testsIncluded: ["Vitamin D", "Vitamin B12", "Calcium"],
        tat: "24 hours",
        fasting: "Not required",
        homeCollection: true,
      },
      {
        packageId: "THY_DIA_001",
        name: "Diabetes Control Package",
        price: 599,
        testsIncluded: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile"],
        tat: "24 hours",
        fasting: "8-12 hours",
        homeCollection: true,
      },
    ],
  },
  {
    providerId: "PROV002",
    name: "Lal Path Labs",
    type: "Lab",
    location: {
      address: "Koregaon Park, Pune",
      pincode: "411001",
      coordinates: { lat: 18.5362, lng: 73.8958 },
    },
    supportedProducts: ["Prime01", "Essential02", "Premium03"],
    rating: 4.4,
    reviews: 2100,
    contact: "+91-20-2605-3456",
    specialties: ["Pathology", "Cardiology"],
    homeCollection: true,
    packages: [
      {
        packageId: "LAL_FBC_001",
        name: "Full Body Checkup",
        price: 1199,
        testsIncluded: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "ESR", "ECG", "HbA1c"],
        tat: "48 hours",
        fasting: "10-12 hours",
        homeCollection: true,
      },
      {
        packageId: "LAL_VIT_001",
        name: "Vitamin Essentials",
        price: 1299,
        testsIncluded: ["Vitamin D", "Vitamin B12", "Vitamin B9 (Folate)", "Calcium", "Iron"],
        tat: "36 hours",
        fasting: "Not required",
        homeCollection: true,
      },
      {
        packageId: "LAL_DIA_001",
        name: "Diabetes Care Package",
        price: 699,
        testsIncluded: [
          "HbA1c",
          "Fasting Blood Sugar",
          "Post Prandial Blood Sugar",
          "Lipid Profile",
          "Kidney Function Test",
        ],
        tat: "36 hours",
        fasting: "8-12 hours",
        homeCollection: true,
      },
    ],
  },
  {
    providerId: "PROV003",
    name: "Ruby Hall Labs",
    type: "Lab",
    location: {
      address: "Sassoon Road, Pune",
      pincode: "411001",
      coordinates: { lat: 18.5204, lng: 73.8567 },
    },
    supportedProducts: ["Premium03"],
    rating: 4.5,
    reviews: 3200,
    contact: "+91-20-2605-1234",
    specialties: ["Pathology", "Cardiology", "Radiology"],
    homeCollection: false,
    packages: [
      {
        packageId: "RUB_FBC_001",
        name: "Comprehensive Health Checkup",
        price: 1599,
        testsIncluded: [
          "CBC",
          "Lipid Profile",
          "Liver Function Test",
          "Kidney Function Test",
          "Thyroid Profile",
          "ECG",
          "Chest X-Ray",
          "Echo",
        ],
        tat: "24 hours",
        fasting: "12 hours",
        homeCollection: false,
      },
      {
        packageId: "RUB_CAR_001",
        name: "Cardiac Risk Assessment",
        price: 999,
        testsIncluded: ["Lipid Profile", "ECG", "Echo", "Troponin", "CRP"],
        tat: "24 hours",
        fasting: "8-12 hours",
        homeCollection: false,
      },
    ],
  },
  {
    providerId: "PROV004",
    name: "Dr. Omkar Patil's Clinic",
    type: "Clinic",
    location: {
      address: "Kharadi, Pune",
      pincode: "411014",
      coordinates: { lat: 18.5515, lng: 73.937 },
    },
    supportedProducts: ["Prime01", "Essential02", "Premium03"],
    rating: 4.7,
    reviews: 950,
    contact: "+91-20-2605-5678",
    specialties: ["General Medicine", "Preventive Health"],
    homeCollection: false,
    packages: [
      {
        packageId: "OMK_CON_001",
        name: "General Consultation",
        price: 500,
        testsIncluded: ["Physical Examination", "BP Check", "Basic Health Assessment"],
        tat: "Same day",
        fasting: "Not required",
        homeCollection: false,
      },
      {
        packageId: "OMK_PRE_001",
        name: "Preventive Health Consultation",
        price: 800,
        testsIncluded: ["Detailed Physical Examination", "Health Risk Assessment", "Lifestyle Counseling"],
        tat: "Same day",
        fasting: "Not required",
        homeCollection: false,
      },
    ],
  },
  {
    providerId: "PROV005",
    name: "Healthians",
    type: "Lab",
    location: {
      address: "Baner, Pune",
      pincode: "411045",
      coordinates: { lat: 18.5593, lng: 73.7785 },
    },
    supportedProducts: ["Prime01", "Essential02"],
    rating: 4.3,
    reviews: 1800,
    contact: "+91-20-2605-9876",
    specialties: ["Pathology", "Home Healthcare"],
    homeCollection: true,
    packages: [
      {
        packageId: "HEA_FBC_001",
        name: "Full Body Checkup",
        price: 999,
        testsIncluded: [
          "CBC",
          "Lipid Profile",
          "Liver Function Test",
          "Kidney Function Test",
          "Thyroid Profile",
          "Vitamin D",
        ],
        tat: "24 hours",
        fasting: "8-10 hours",
        homeCollection: true,
      },
      {
        packageId: "HEA_VIT_001",
        name: "Vitamin D Test",
        price: 599,
        testsIncluded: ["Vitamin D only"],
        tat: "24 hours",
        fasting: "Not required",
        homeCollection: true,
      },
    ],
  },
]

export function getProvidersByPincode(pincode) {
  return providerNetwork.filter((provider) => provider.location.pincode === pincode)
}

export function getProvidersByProduct(product) {
  return providerNetwork.filter((provider) => provider.supportedProducts.includes(product))
}

export function getProviderByName(name) {
  return providerNetwork.find((provider) => provider.name.toLowerCase().includes(name.toLowerCase()))
}

export function getProviderById(providerId) {
  return providerNetwork.find((provider) => provider.providerId === providerId)
}

export function searchProviders(query) {
  const lowerQuery = query.toLowerCase()
  return providerNetwork.filter(
    (provider) =>
      provider.name.toLowerCase().includes(lowerQuery) ||
      provider.specialties.some((specialty) => specialty.toLowerCase().includes(lowerQuery)) ||
      provider.location.address.toLowerCase().includes(lowerQuery),
  )
}
