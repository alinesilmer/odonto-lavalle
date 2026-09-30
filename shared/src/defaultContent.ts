import type { ContentInput, ContentKind } from "./dto/content";

/**
 * The site's original FAQ, services and obras sociales. The public site shows
 * them while the database has none, the dashboard's "Cargar el contenido
 * actual" copies them in, and `npm run seed:content -w backend` does the same
 * from the command line.
 */
export const DEFAULT_CONTENT: { [K in ContentKind]: ContentInput<K>[] } = {
  faqs: [
    {
      question: "¿Puedo reservar un tratamiento sin una consulta previa?",
      answer: "No. Primero hacemos una consulta de evaluación para revisar tu caso, explicar opciones y armar un presupuesto. Recién después agendamos el tratamiento adecuado. Esto evita sorpresas y asegura el mejor resultado para vos.",
      order: 0
    },
    {
      question: "¿Qué obras sociales/prepagas y medios de pago aceptan?",
      answer: "Trabajamos con obras sociales y prepagas seleccionadas (confirmá cobertura al reservar). Aceptamos tarjeta de crédito, tarjeta de débito, efectivo o transferencia. Si tenés dudas sobre autorizaciones o reintegros, te orientamos con la documentación necesaria.",
      order: 1
    },
    {
      question: "¿Atienden urgencias? ¿Cómo procedo fuera del horario de atención?",
      answer: "Sí, priorizamos urgencias (dolor intenso, sangrado, traumatismos, abscesos). En horario de atención: llamanos o escribinos por WhatsApp y te damos turno prioritario. Fuera de horario: si no respondemos, acudí a la guardia odontológica más cercana. Medidas útiles: compresas frías externas para bajar inflamación; si se fractura un diente, conservá el fragmento en leche o saliva y vení lo antes posible.",
      order: 2
    }
  ],
  services: [
    {
      title: "CONSULTA",
      description: "Evaluación integral y plan de tratamiento.",
      image: "https://i.pinimg.com/1200x/e0/47/d7/e047d74c749650954954158b2634d8ee.jpg",
      category: "otros",
      order: 0
    },
    {
      title: "LIMPIEZA",
      description: "Remoción de placa, sarro y pulido dental",
      image: "https://i.pinimg.com/1200x/38/6e/c4/386ec4afdad23234a23979c44532cb2b.jpg",
      category: "otros",
      order: 1
    },
    {
      title: "ALINEADORES",
      description: "Alineación dental con férulas transparentes",
      image: "https://i.pinimg.com/736x/4d/e4/1b/4de41bfe84a332805bc0a19b330e0cbc.jpg",
      category: "otros",
      order: 2
    },
    {
      title: "RADIOGRAFÍAS",
      description: "Imágenes claras para diagnósticos precisos",
      image: "https://i.pinimg.com/1200x/35/3d/c1/353dc17e19aa134a1b3e99b5019a0fb1.jpg",
      category: "otros",
      order: 3
    },
    {
      title: "ODONTOPEDIATRÍA",
      description: "Atención dental especializada para niños",
      image: "https://i.pinimg.com/736x/81/1b/e3/811be3f049f1a1dcdba340f89b008733.jpg",
      category: "otros",
      order: 4
    },
    {
      title: "IMPLANTES",
      description: "Reemplazo de dientes con tornillo de titanio",
      image: "https://i.pinimg.com/736x/37/4d/ca/374dca779b96eba3c66fc379d5136d87.jpg",
      category: "cirugia",
      order: 5
    },
    {
      title: "CARILLAS",
      description: "Mejora estética de forma y color",
      image: "https://i.pinimg.com/736x/fc/62/2f/fc622f2d807bcab5d67712d6f074c809.jpg",
      category: "estetica",
      order: 6
    },
    {
      title: "TRATAMIENTO DE CONDUCTO",
      description: "Desinfección y sellado de conductos dentales",
      image: "https://i.pinimg.com/1200x/f8/10/8d/f8108d93d23ce7190e87bb230efe19ef.jpg",
      category: "tratamiento de conducto",
      order: 7
    },
    {
      title: "BLANQUEAMIENTO",
      description: "Mejora la apariencia, realzando la sonrisa natural",
      image: "https://i.pinimg.com/736x/d8/64/e6/d864e65c3d5a32a5f8753479c2feae83.jpg",
      category: "estetica",
      order: 8
    },
    {
      title: "ORTODONCIA TRADICIONAL",
      description: "Alineá tus dientes con la mejor atención",
      image: "https://i.pinimg.com/736x/df/41/38/df4138cd5ead262c3655c50900ec4265.jpg",
      category: "otros",
      order: 9
    }
  ],
  insurances: [
    {
      name: "Jerárquicos Salud",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928376/jerarquicossalud_logo_blue_rnrc9q.png",
      order: 0
    },
    {
      name: "Swiss Medical",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928438/swissmedical_yuyhyb.png",
      order: 1
    },
    {
      name: "ISSUNNE",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932182/issunne_kwrhv5.png",
      order: 2
    },
    {
      name: "SanCor Salud",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928437/sancor_r7ylav.png",
      order: 3
    },
    {
      name: "Medifé",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932182/medife_mf71ll.png",
      order: 4
    },
    {
      name: "Galeno",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761928438/galeno_osprxo.png",
      order: 5
    },
    {
      name: "OSPIM",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1762015725/ospim_qlpfpv.png",
      order: 6
    },
    {
      name: "OSPJN",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932181/ospjn_qrgk8f.png",
      order: 7
    },
    {
      name: "SADAIC",
      logo: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1761932184/sadaic_gms7uk.png",
      order: 8
    }
  ],
};
