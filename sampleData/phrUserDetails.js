export const userDetails = {
  HAN123456: {
    han: "HAN123456",
    name: "Omkar P",
    mobileNumber: "9168876260",
    dob: "10/04/2001",
    product: "Prime01",
    address: "Kharadi, Pune",
    pincode: "411014",
    coverages: {
      doctorWallet: { available: 2000, total: 5000 },
      labWallet: {
        available: 6000,
        total: 10000,
        includes: ["Lab Tests", "PHC", "Sonography", "ECG"],
      },
    },
  },
  HAN789012: {
    han: "HAN789012",
    name: "Priya Sharma",
    mobileNumber: "9876543210",
    dob: "15/08/1995",
    product: "Essential02",
    address: "Viman Nagar, Pune",
    pincode: "411014",
    coverages: {
      doctorWallet: { available: 1500, total: 3000 },
      labWallet: {
        available: 4500,
        total: 7000,
        includes: ["Lab Tests", "PHC"],
      },
    },
  },
  HAN345678: {
    han: "HAN345678",
    name: "Rahul Patel",
    mobileNumber: "8765432109",
    dob: "22/12/1988",
    product: "Premium03",
    address: "Koregaon Park, Pune",
    pincode: "411001",
    coverages: {
      doctorWallet: { available: 3000, total: 8000 },
      labWallet: {
        available: 8000,
        total: 15000,
        includes: ["Lab Tests", "PHC", "Sonography", "ECG", "X-Ray", "MRI"],
      },
    },
  },
}

export function getUserDetails(han) {
  return userDetails[han] || null
}
