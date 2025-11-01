import type { InsuranceProvider, PaymentMethod } from "../types"

export const insuranceProviders: InsuranceProvider[] = [
  { id: "1", name: "Jerárquicos Salud", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928376/jerarquicossalud_logo_blue_rnrc9q.png" },
  { id: "2", name: "Swiss Medical", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928438/swissmedical_yuyhyb.png" },
  { id: "3", name: "ISSUNNE", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932182/issunne_kwrhv5.png" },
  { id: "4", name: "SanCor Salud", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928437/sancor_r7ylav.png" },
  { id: "5", name: "Medifé", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932182/medife_mf71ll.png" },
  { id: "6", name: "Galeno", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928438/galeno_osprxo.png"},
  { id: "7", name: "OSPIM", logo: "https://imgs.search.brave.com/tN2P24WBtfE58HIqf-VtARv7rtbH3GOrcEzdNPKu0Iw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/MTg1MzMwOC92ZWN0/b3IvcGFnZS1ub3Qt/Zm91bmQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXBTX0ky/VG1CaFhsN2FhT1ct/MGlHb19EZ0ZqNnhy/U244Mkk3Q3dtWFV3/TDQ9"},
  { id: "8", name: "OSPJN", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932181/ospjn_qrgk8f.png"},
  { id: "8", name: "SADAIC", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932184/sadaic_gms7uk.png"},
]

export const paymentMethods: PaymentMethod[] = [
  { id: "1", name: "Efectivo", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928436/efectivo_icarwb.png" },
  { id: "2", name: "Mercado Pago", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928435/mercadopago_yjhulp.png" },
  { id: "3", name: "Mastercard", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928436/mastercard_nampw5.png" },
  { id: "4", name: "Visa", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928437/visa_hxzjcd.png" },
  { id: "5", name: "Personal Pay", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928437/personalpay_wxdzje.png" },
  { id: "6", name: "Ualá", logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928436/uala_akxa1o.png" },
]
