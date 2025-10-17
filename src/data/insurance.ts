import type { InsuranceProvider, PaymentMethod } from "../types"
import swiss from "../assets/images/os/swissmedical.png";
import sancor from "../assets/images/os/sancor.png";
import ioscor from "../assets/images/os/ioscor.jpg";
import pami from "../assets/images/os/pami.jpg";
import osde from "../assets/images/os/osde.png";
import galeno from "../assets/images/os/galeno.png";
import visa from "../assets/images/os/visa.png";
import uala from "../assets/images/os/uala.png";
import mp from "../assets/images/os/mercadopago.png";
import personalpay from "../assets/images/os/personalpay.png";
import mastercard from "../assets/images/os/mastercard.png";
import efectivo from "../assets/images/os/efectivo.png";

export const insuranceProviders: InsuranceProvider[] = [
  { id: "1", name: "OSDE", logo: osde },
  { id: "2", name: "Swiss Medical", logo: swiss },
  { id: "3", name: "IOSCor", logo: ioscor },
  { id: "4", name: "SanCor Salud", logo: sancor },
  { id: "5", name: "PAMI", logo: pami },
  { id: "6", name: "Galeno", logo: galeno},
]

export const paymentMethods: PaymentMethod[] = [
  { id: "1", name: "Efectivo", logo: efectivo },
  { id: "2", name: "Mercado Pago", logo: mp },
  { id: "3", name: "Mastercard", logo: mastercard },
  { id: "4", name: "Visa", logo: visa },
  { id: "5", name: "Personal Pay", logo: personalpay },
  { id: "6", name: "Ualá", logo: uala },
]
