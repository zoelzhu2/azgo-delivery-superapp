export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  provinceId: string;
  name: string;
  type: 'KOTA' | 'KABUPATEN';
}

export interface District {
  id: string;
  regencyId: string;
  name: string;
  lat: number;
  lng: number;
  postalCode: string;
  fullName?: string;
}

export const INDONESIA_PROVINCES: Province[] = [
  {
    "id": "p-jatim",
    "name": "Jawa Timur"
  },
  {
    "id": "p-dki",
    "name": "DKI Jakarta"
  },
  {
    "id": "p-jabar",
    "name": "Jawa Barat"
  },
  {
    "id": "p-jateng",
    "name": "Jawa Tengah"
  },
  {
    "id": "p-diy",
    "name": "DI Yogyakarta"
  },
  {
    "id": "p-banten",
    "name": "Banten"
  },
  {
    "id": "p-bali",
    "name": "Bali"
  },
  {
    "id": "p-ntb",
    "name": "Nusa Tenggara Barat"
  },
  {
    "id": "p-ntt",
    "name": "Nusa Tenggara Timur"
  },
  {
    "id": "p-aceh",
    "name": "Aceh"
  },
  {
    "id": "p-sumut",
    "name": "Sumatera Utara"
  },
  {
    "id": "p-sumbar",
    "name": "Sumatera Barat"
  },
  {
    "id": "p-riau",
    "name": "Riau"
  },
  {
    "id": "p-kepri",
    "name": "Kepulauan Riau"
  },
  {
    "id": "p-jambi",
    "name": "Jambi"
  },
  {
    "id": "p-sumsel",
    "name": "Sumatera Selatan"
  },
  {
    "id": "p-babel",
    "name": "Kepulauan Bangka Belitung"
  },
  {
    "id": "p-bengkulu",
    "name": "Bengkulu"
  },
  {
    "id": "p-lampung",
    "name": "Lampung"
  },
  {
    "id": "p-kalbar",
    "name": "Kalimantan Barat"
  },
  {
    "id": "p-kalteng",
    "name": "Kalimantan Tengah"
  },
  {
    "id": "p-kalsel",
    "name": "Kalimantan Selatan"
  },
  {
    "id": "p-kaltim",
    "name": "Kalimantan Timur"
  },
  {
    "id": "p-kaltara",
    "name": "Kalimantan Utara"
  },
  {
    "id": "p-sulut",
    "name": "Sulawesi Utara"
  },
  {
    "id": "p-gorontalo",
    "name": "Gorontalo"
  },
  {
    "id": "p-sulteng",
    "name": "Sulawesi Tengah"
  },
  {
    "id": "p-sulbar",
    "name": "Sulawesi Barat"
  },
  {
    "id": "p-sulsel",
    "name": "Sulawesi Selatan"
  },
  {
    "id": "p-sultra",
    "name": "Sulawesi Tenggara"
  },
  {
    "id": "p-maluku",
    "name": "Maluku"
  },
  {
    "id": "p-malut",
    "name": "Maluku Utara"
  },
  {
    "id": "p-papua",
    "name": "Papua"
  },
  {
    "id": "p-papuabrt",
    "name": "Papua Barat"
  },
  {
    "id": "p-papuasel",
    "name": "Papua Selatan"
  },
  {
    "id": "p-papuatgh",
    "name": "Papua Tengah"
  },
  {
    "id": "p-papuapeg",
    "name": "Papua Pegunungan"
  },
  {
    "id": "p-papuabdt",
    "name": "Papua Barat Daya"
  }
];

export const INDONESIA_REGENCIES: Regency[] = [
  {
    "id": "r-sby-kota",
    "provinceId": "p-jatim",
    "name": "Kota Surabaya",
    "type": "KOTA"
  },
  {
    "id": "r-mlg-kota",
    "provinceId": "p-jatim",
    "name": "Kota Malang",
    "type": "KOTA"
  },
  {
    "id": "r-btu-kota",
    "provinceId": "p-jatim",
    "name": "Kota Batu",
    "type": "KOTA"
  },
  {
    "id": "r-kdr-kota",
    "provinceId": "p-jatim",
    "name": "Kota Kediri",
    "type": "KOTA"
  },
  {
    "id": "r-blt-kota",
    "provinceId": "p-jatim",
    "name": "Kota Blitar",
    "type": "KOTA"
  },
  {
    "id": "r-mdn-kota-jatim",
    "provinceId": "p-jatim",
    "name": "Kota Madiun",
    "type": "KOTA"
  },
  {
    "id": "r-mjk-kota",
    "provinceId": "p-jatim",
    "name": "Kota Mojokerto",
    "type": "KOTA"
  },
  {
    "id": "r-psr-kota",
    "provinceId": "p-jatim",
    "name": "Kota Pasuruan",
    "type": "KOTA"
  },
  {
    "id": "r-prb-kota",
    "provinceId": "p-jatim",
    "name": "Kota Probolinggo",
    "type": "KOTA"
  },
  {
    "id": "r-sda-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Sidoarjo",
    "type": "KABUPATEN"
  },
  {
    "id": "r-grk-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Gresik",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bkl-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Bangkalan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-byw-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Banyuwangi",
    "type": "KABUPATEN"
  },
  {
    "id": "r-blt-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Blitar",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bjn-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Bojonegoro",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bdw-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Bondowoso",
    "type": "KABUPATEN"
  },
  {
    "id": "r-jbr-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Jember",
    "type": "KABUPATEN"
  },
  {
    "id": "r-jbg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Jombang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-kdr-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Kediri",
    "type": "KABUPATEN"
  },
  {
    "id": "r-lmg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Lamongan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-lmj-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Lumajang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mdn-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Madiun",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mgt-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Magetan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mlg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Malang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mjk-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Mojokerto",
    "type": "KABUPATEN"
  },
  {
    "id": "r-ngj-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Nganjuk",
    "type": "KABUPATEN"
  },
  {
    "id": "r-ngw-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Ngawi",
    "type": "KABUPATEN"
  },
  {
    "id": "r-pct-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Pacitan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-pmk-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Pamekasan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-psr-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Pasuruan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-png-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Ponorogo",
    "type": "KABUPATEN"
  },
  {
    "id": "r-prb-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Probolinggo",
    "type": "KABUPATEN"
  },
  {
    "id": "r-spg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Sampang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-stb-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Situbondo",
    "type": "KABUPATEN"
  },
  {
    "id": "r-smp-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Sumenep",
    "type": "KABUPATEN"
  },
  {
    "id": "r-trg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Trenggalek",
    "type": "KABUPATEN"
  },
  {
    "id": "r-tbn-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Tuban",
    "type": "KABUPATEN"
  },
  {
    "id": "r-tlg-kab",
    "provinceId": "p-jatim",
    "name": "Kabupaten Tulungagung",
    "type": "KABUPATEN"
  },
  {
    "id": "r-jkt-pusat",
    "provinceId": "p-dki",
    "name": "Kota Jakarta Pusat",
    "type": "KOTA"
  },
  {
    "id": "r-jkt-selatan",
    "provinceId": "p-dki",
    "name": "Kota Jakarta Selatan",
    "type": "KOTA"
  },
  {
    "id": "r-jkt-barat",
    "provinceId": "p-dki",
    "name": "Kota Jakarta Barat",
    "type": "KOTA"
  },
  {
    "id": "r-jkt-timur",
    "provinceId": "p-dki",
    "name": "Kota Jakarta Timur",
    "type": "KOTA"
  },
  {
    "id": "r-jkt-utara",
    "provinceId": "p-dki",
    "name": "Kota Jakarta Utara",
    "type": "KOTA"
  },
  {
    "id": "r-jkt-kepseribu",
    "provinceId": "p-dki",
    "name": "Kabupaten Kepulauan Seribu",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bdg-kota",
    "provinceId": "p-jabar",
    "name": "Kota Bandung",
    "type": "KOTA"
  },
  {
    "id": "r-bdg-kab",
    "provinceId": "p-jabar",
    "name": "Kabupaten Bandung",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bdg-barat",
    "provinceId": "p-jabar",
    "name": "Kabupaten Bandung Barat",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bgr-kota",
    "provinceId": "p-jabar",
    "name": "Kota Bogor",
    "type": "KOTA"
  },
  {
    "id": "r-bgr-kab",
    "provinceId": "p-jabar",
    "name": "Kabupaten Bogor",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bks-kota",
    "provinceId": "p-jabar",
    "name": "Kota Bekasi",
    "type": "KOTA"
  },
  {
    "id": "r-bks-kab",
    "provinceId": "p-jabar",
    "name": "Kabupaten Bekasi",
    "type": "KABUPATEN"
  },
  {
    "id": "r-dpk-kota",
    "provinceId": "p-jabar",
    "name": "Kota Depok",
    "type": "KOTA"
  },
  {
    "id": "r-cmh-kota",
    "provinceId": "p-jabar",
    "name": "Kota Cimahi",
    "type": "KOTA"
  },
  {
    "id": "r-crb-kota",
    "provinceId": "p-jabar",
    "name": "Kota Cirebon",
    "type": "KOTA"
  },
  {
    "id": "r-crb-kab",
    "provinceId": "p-jabar",
    "name": "Kabupaten Cirebon",
    "type": "KABUPATEN"
  },
  {
    "id": "r-skb-kota",
    "provinceId": "p-jabar",
    "name": "Kota Sukabumi",
    "type": "KOTA"
  },
  {
    "id": "r-tsm-kota",
    "provinceId": "p-jabar",
    "name": "Kota Tasikmalaya",
    "type": "KOTA"
  },
  {
    "id": "r-krawang-kab",
    "provinceId": "p-jabar",
    "name": "Kabupaten Karawang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-smg-kota",
    "provinceId": "p-jateng",
    "name": "Kota Semarang",
    "type": "KOTA"
  },
  {
    "id": "r-smg-kab",
    "provinceId": "p-jateng",
    "name": "Kabupaten Semarang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-slo-kota",
    "provinceId": "p-jateng",
    "name": "Kota Surakarta (Solo)",
    "type": "KOTA"
  },
  {
    "id": "r-mgl-kota",
    "provinceId": "p-jateng",
    "name": "Kota Magelang",
    "type": "KOTA"
  },
  {
    "id": "r-slt-kota",
    "provinceId": "p-jateng",
    "name": "Kota Salatiga",
    "type": "KOTA"
  },
  {
    "id": "r-pkl-kota",
    "provinceId": "p-jateng",
    "name": "Kota Pekalongan",
    "type": "KOTA"
  },
  {
    "id": "r-tgl-kota",
    "provinceId": "p-jateng",
    "name": "Kota Tegal",
    "type": "KOTA"
  },
  {
    "id": "r-bms-kab",
    "provinceId": "p-jateng",
    "name": "Kabupaten Banyumas (Purwokerto)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-clp-kab",
    "provinceId": "p-jateng",
    "name": "Kabupaten Cilacap",
    "type": "KABUPATEN"
  },
  {
    "id": "r-kds-kab",
    "provinceId": "p-jateng",
    "name": "Kabupaten Kudus",
    "type": "KABUPATEN"
  },
  {
    "id": "r-yog-kota",
    "provinceId": "p-diy",
    "name": "Kota Yogyakarta",
    "type": "KOTA"
  },
  {
    "id": "r-slm-kab",
    "provinceId": "p-diy",
    "name": "Kabupaten Sleman",
    "type": "KABUPATEN"
  },
  {
    "id": "r-btl-kab",
    "provinceId": "p-diy",
    "name": "Kabupaten Bantul",
    "type": "KABUPATEN"
  },
  {
    "id": "r-klp-kab",
    "provinceId": "p-diy",
    "name": "Kabupaten Kulon Progo",
    "type": "KABUPATEN"
  },
  {
    "id": "r-gnk-kab",
    "provinceId": "p-diy",
    "name": "Kabupaten Gunungkidul",
    "type": "KABUPATEN"
  },
  {
    "id": "r-tgr-kota",
    "provinceId": "p-banten",
    "name": "Kota Tangerang",
    "type": "KOTA"
  },
  {
    "id": "r-tgs-kota",
    "provinceId": "p-banten",
    "name": "Kota Tangerang Selatan",
    "type": "KOTA"
  },
  {
    "id": "r-tgr-kab",
    "provinceId": "p-banten",
    "name": "Kabupaten Tangerang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-srn-kota",
    "provinceId": "p-banten",
    "name": "Kota Serang",
    "type": "KOTA"
  },
  {
    "id": "r-srn-kab",
    "provinceId": "p-banten",
    "name": "Kabupaten Serang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-clg-kota",
    "provinceId": "p-banten",
    "name": "Kota Cilegon",
    "type": "KOTA"
  },
  {
    "id": "r-lbk-kab",
    "provinceId": "p-banten",
    "name": "Kabupaten Lebak",
    "type": "KABUPATEN"
  },
  {
    "id": "r-pdg-kab",
    "provinceId": "p-banten",
    "name": "Kabupaten Pandeglang",
    "type": "KABUPATEN"
  },
  {
    "id": "r-dps-kota",
    "provinceId": "p-bali",
    "name": "Kota Denpasar",
    "type": "KOTA"
  },
  {
    "id": "r-bdg-bali-kab",
    "provinceId": "p-bali",
    "name": "Kabupaten Badung (Kuta/Canggu)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-gny-kab",
    "provinceId": "p-bali",
    "name": "Kabupaten Gianyar (Ubud)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-tbn-bali-kab",
    "provinceId": "p-bali",
    "name": "Kabupaten Tabanan",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bll-kab",
    "provinceId": "p-bali",
    "name": "Kabupaten Buleleng (Singaraja)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mtr-kota",
    "provinceId": "p-ntb",
    "name": "Kota Mataram",
    "type": "KOTA"
  },
  {
    "id": "r-lbr-kab",
    "provinceId": "p-ntb",
    "name": "Kabupaten Lombok Barat",
    "type": "KABUPATEN"
  },
  {
    "id": "r-kpg-kota",
    "provinceId": "p-ntt",
    "name": "Kota Kupang",
    "type": "KOTA"
  },
  {
    "id": "r-mrg-kab",
    "provinceId": "p-ntt",
    "name": "Kabupaten Manggarai Barat (Labuan Bajo)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-bna-kota",
    "provinceId": "p-aceh",
    "name": "Kota Banda Aceh",
    "type": "KOTA"
  },
  {
    "id": "r-mdn-kota",
    "provinceId": "p-sumut",
    "name": "Kota Medan",
    "type": "KOTA"
  },
  {
    "id": "r-pdg-kota",
    "provinceId": "p-sumbar",
    "name": "Kota Padang",
    "type": "KOTA"
  },
  {
    "id": "r-pku-kota",
    "provinceId": "p-riau",
    "name": "Kota Pekanbaru",
    "type": "KOTA"
  },
  {
    "id": "r-btm-kota",
    "provinceId": "p-kepri",
    "name": "Kota Batam",
    "type": "KOTA"
  },
  {
    "id": "r-tpi-kota",
    "provinceId": "p-kepri",
    "name": "Kota Tanjung Pinang",
    "type": "KOTA"
  },
  {
    "id": "r-jmb-kota",
    "provinceId": "p-jambi",
    "name": "Kota Jambi",
    "type": "KOTA"
  },
  {
    "id": "r-plb-kota",
    "provinceId": "p-sumsel",
    "name": "Kota Palembang",
    "type": "KOTA"
  },
  {
    "id": "r-pkp-kota",
    "provinceId": "p-babel",
    "name": "Kota Pangkal Pinang",
    "type": "KOTA"
  },
  {
    "id": "r-bkl-sum-kota",
    "provinceId": "p-bengkulu",
    "name": "Kota Bengkulu",
    "type": "KOTA"
  },
  {
    "id": "r-bdl-kota",
    "provinceId": "p-lampung",
    "name": "Kota Bandar Lampung",
    "type": "KOTA"
  },
  {
    "id": "r-ptk-kota",
    "provinceId": "p-kalbar",
    "name": "Kota Pontianak",
    "type": "KOTA"
  },
  {
    "id": "r-pkr-kota",
    "provinceId": "p-kalteng",
    "name": "Kota Palangka Raya",
    "type": "KOTA"
  },
  {
    "id": "r-bjm-kota",
    "provinceId": "p-kalsel",
    "name": "Kota Banjarmasin",
    "type": "KOTA"
  },
  {
    "id": "r-bjp-kota",
    "provinceId": "p-kalsel",
    "name": "Kota Banjarbaru",
    "type": "KOTA"
  },
  {
    "id": "r-smd-kota",
    "provinceId": "p-kaltim",
    "name": "Kota Samarinda",
    "type": "KOTA"
  },
  {
    "id": "r-bpn-kota",
    "provinceId": "p-kaltim",
    "name": "Kota Balikpapan",
    "type": "KOTA"
  },
  {
    "id": "r-ikn-kab",
    "provinceId": "p-kaltim",
    "name": "Kawasan Ibu Kota Nusantara (IKN)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-trk-kota",
    "provinceId": "p-kaltara",
    "name": "Kota Tarakan",
    "type": "KOTA"
  },
  {
    "id": "r-mnd-kota",
    "provinceId": "p-sulut",
    "name": "Kota Manado",
    "type": "KOTA"
  },
  {
    "id": "r-gto-kota",
    "provinceId": "p-gorontalo",
    "name": "Kota Gorontalo",
    "type": "KOTA"
  },
  {
    "id": "r-palu-kota",
    "provinceId": "p-sulteng",
    "name": "Kota Palu",
    "type": "KOTA"
  },
  {
    "id": "r-mamuju-kab",
    "provinceId": "p-sulbar",
    "name": "Kabupaten Mamuju",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mks-kota",
    "provinceId": "p-sulsel",
    "name": "Kota Makassar",
    "type": "KOTA"
  },
  {
    "id": "r-kdr-sul-kota",
    "provinceId": "p-sultra",
    "name": "Kota Kendari",
    "type": "KOTA"
  },
  {
    "id": "r-amb-kota",
    "provinceId": "p-maluku",
    "name": "Kota Ambon",
    "type": "KOTA"
  },
  {
    "id": "r-tnt-kota",
    "provinceId": "p-malut",
    "name": "Kota Ternate",
    "type": "KOTA"
  },
  {
    "id": "r-jyp-kota",
    "provinceId": "p-papua",
    "name": "Kota Jayapura",
    "type": "KOTA"
  },
  {
    "id": "r-mnk-kab",
    "provinceId": "p-papuabrt",
    "name": "Kabupaten Manokwari",
    "type": "KABUPATEN"
  },
  {
    "id": "r-mrk-kab",
    "provinceId": "p-papuasel",
    "name": "Kabupaten Merauke",
    "type": "KABUPATEN"
  },
  {
    "id": "r-nbr-kab",
    "provinceId": "p-papuatgh",
    "name": "Kabupaten Nabire",
    "type": "KABUPATEN"
  },
  {
    "id": "r-wmn-kab",
    "provinceId": "p-papuapeg",
    "name": "Kabupaten Jayawijaya (Wamena)",
    "type": "KABUPATEN"
  },
  {
    "id": "r-srg-kota",
    "provinceId": "p-papuabdt",
    "name": "Kota Sorong",
    "type": "KOTA"
  }
];

export const INDONESIA_DISTRICTS: District[] = [
  {
    "id": "d-sby-genteng",
    "regencyId": "r-sby-kota",
    "name": "Genteng",
    "lat": -7.2617,
    "lng": 112.7486,
    "postalCode": "60275"
  },
  {
    "id": "d-sby-tegalsari",
    "regencyId": "r-sby-kota",
    "name": "Tegalsari",
    "lat": -7.2714,
    "lng": 112.7397,
    "postalCode": "60262"
  },
  {
    "id": "d-sby-bubutan",
    "regencyId": "r-sby-kota",
    "name": "Bubutan",
    "lat": -7.2514,
    "lng": 112.7342,
    "postalCode": "60174"
  },
  {
    "id": "d-sby-simokerto",
    "regencyId": "r-sby-kota",
    "name": "Simokerto",
    "lat": -7.2392,
    "lng": 112.7561,
    "postalCode": "60143"
  },
  {
    "id": "d-sby-tambaksari",
    "regencyId": "r-sby-kota",
    "name": "Tambaksari",
    "lat": -7.2522,
    "lng": 112.7661,
    "postalCode": "60136"
  },
  {
    "id": "d-sby-gubeng",
    "regencyId": "r-sby-kota",
    "name": "Gubeng",
    "lat": -7.2792,
    "lng": 112.7561,
    "postalCode": "60281"
  },
  {
    "id": "d-sby-rungkut",
    "regencyId": "r-sby-kota",
    "name": "Rungkut",
    "lat": -7.3242,
    "lng": 112.7828,
    "postalCode": "60293"
  },
  {
    "id": "d-sby-tenggilis",
    "regencyId": "r-sby-kota",
    "name": "Tenggilis Mejoyo",
    "lat": -7.3189,
    "lng": 112.7644,
    "postalCode": "60292"
  },
  {
    "id": "d-sby-gununganyar",
    "regencyId": "r-sby-kota",
    "name": "Gunung Anyar",
    "lat": -7.3389,
    "lng": 112.7961,
    "postalCode": "60294"
  },
  {
    "id": "d-sby-sukolilo",
    "regencyId": "r-sby-kota",
    "name": "Sukolilo",
    "lat": -7.2892,
    "lng": 112.7981,
    "postalCode": "60111"
  },
  {
    "id": "d-sby-mulyorejo",
    "regencyId": "r-sby-kota",
    "name": "Mulyorejo",
    "lat": -7.2694,
    "lng": 112.7933,
    "postalCode": "60115"
  },
  {
    "id": "d-sby-sawahan",
    "regencyId": "r-sby-kota",
    "name": "Sawahan",
    "lat": -7.2783,
    "lng": 112.7231,
    "postalCode": "60251"
  },
  {
    "id": "d-sby-wonokromo",
    "regencyId": "r-sby-kota",
    "name": "Wonokromo",
    "lat": -7.3006,
    "lng": 112.7381,
    "postalCode": "60241"
  },
  {
    "id": "d-sby-wonocolo",
    "regencyId": "r-sby-kota",
    "name": "Wonocolo",
    "lat": -7.3172,
    "lng": 112.7394,
    "postalCode": "60237"
  },
  {
    "id": "d-sby-wiyung",
    "regencyId": "r-sby-kota",
    "name": "Wiyung",
    "lat": -7.3117,
    "lng": 112.6953,
    "postalCode": "60228"
  },
  {
    "id": "d-sby-karangpilang",
    "regencyId": "r-sby-kota",
    "name": "Karangpilang",
    "lat": -7.3361,
    "lng": 112.6944,
    "postalCode": "60221"
  },
  {
    "id": "d-sby-jambangan",
    "regencyId": "r-sby-kota",
    "name": "Jambangan",
    "lat": -7.3256,
    "lng": 112.7167,
    "postalCode": "60232"
  },
  {
    "id": "d-sby-gayungan",
    "regencyId": "r-sby-kota",
    "name": "Gayungan",
    "lat": -7.3344,
    "lng": 112.7267,
    "postalCode": "60235"
  },
  {
    "id": "d-sby-dukuhpakis",
    "regencyId": "r-sby-kota",
    "name": "Dukuh Pakis",
    "lat": -7.2917,
    "lng": 112.7033,
    "postalCode": "60225"
  },
  {
    "id": "d-sby-benowo",
    "regencyId": "r-sby-kota",
    "name": "Benowo",
    "lat": -7.2417,
    "lng": 112.6367,
    "postalCode": "60195"
  },
  {
    "id": "d-sby-pakal",
    "regencyId": "r-sby-kota",
    "name": "Pakal",
    "lat": -7.2361,
    "lng": 112.6167,
    "postalCode": "60196"
  },
  {
    "id": "d-sby-asemrowo",
    "regencyId": "r-sby-kota",
    "name": "Asemrowo",
    "lat": -7.2456,
    "lng": 112.7067,
    "postalCode": "60182"
  },
  {
    "id": "d-sby-sukomanunggal",
    "regencyId": "r-sby-kota",
    "name": "Sukomanunggal",
    "lat": -7.2711,
    "lng": 112.7006,
    "postalCode": "60188"
  },
  {
    "id": "d-sby-tandes",
    "regencyId": "r-sby-kota",
    "name": "Tandes",
    "lat": -7.2564,
    "lng": 112.6781,
    "postalCode": "60186"
  },
  {
    "id": "d-sby-sambikerep",
    "regencyId": "r-sby-kota",
    "name": "Sambikerep",
    "lat": -7.2789,
    "lng": 112.6611,
    "postalCode": "60217"
  },
  {
    "id": "d-sby-lakarsantri",
    "regencyId": "r-sby-kota",
    "name": "Lakarsantri",
    "lat": -7.3111,
    "lng": 112.6583,
    "postalCode": "60211"
  },
  {
    "id": "d-sby-bulak",
    "regencyId": "r-sby-kota",
    "name": "Bulak",
    "lat": -7.2361,
    "lng": 112.7972,
    "postalCode": "60124"
  },
  {
    "id": "d-sby-kenjeran",
    "regencyId": "r-sby-kota",
    "name": "Kenjeran",
    "lat": -7.2289,
    "lng": 112.7811,
    "postalCode": "60129"
  },
  {
    "id": "d-sby-semampir",
    "regencyId": "r-sby-kota",
    "name": "Semampir (Ampel)",
    "lat": -7.2217,
    "lng": 112.7483,
    "postalCode": "60155"
  },
  {
    "id": "d-sby-pabeancantian",
    "regencyId": "r-sby-kota",
    "name": "Pabean Cantian",
    "lat": -7.2294,
    "lng": 112.7389,
    "postalCode": "60162"
  },
  {
    "id": "d-sby-krembangan",
    "regencyId": "r-sby-kota",
    "name": "Krembangan",
    "lat": -7.2394,
    "lng": 112.7278,
    "postalCode": "60175"
  },
  {
    "id": "d-mlg-klojen",
    "regencyId": "r-mlg-kota",
    "name": "Klojen (Pusat)",
    "lat": -7.9786,
    "lng": 112.6317,
    "postalCode": "65111"
  },
  {
    "id": "d-mlg-blimbing",
    "regencyId": "r-mlg-kota",
    "name": "Blimbing",
    "lat": -7.9392,
    "lng": 112.6467,
    "postalCode": "65126"
  },
  {
    "id": "d-mlg-kedungkandang",
    "regencyId": "r-mlg-kota",
    "name": "Kedungkandang",
    "lat": -7.9942,
    "lng": 112.6611,
    "postalCode": "65136"
  },
  {
    "id": "d-mlg-lowokwaru",
    "regencyId": "r-mlg-kota",
    "name": "Lowokwaru",
    "lat": -7.9439,
    "lng": 112.6156,
    "postalCode": "65141"
  },
  {
    "id": "d-mlg-sukun",
    "regencyId": "r-mlg-kota",
    "name": "Sukun",
    "lat": -7.9972,
    "lng": 112.6144,
    "postalCode": "65147"
  },
  {
    "id": "d-btu-batu",
    "regencyId": "r-btu-kota",
    "name": "Batu",
    "lat": -7.8711,
    "lng": 112.5272,
    "postalCode": "65311"
  },
  {
    "id": "d-btu-bumiaji",
    "regencyId": "r-btu-kota",
    "name": "Bumiaji",
    "lat": -7.8286,
    "lng": 112.5358,
    "postalCode": "65331"
  },
  {
    "id": "d-btu-junrejo",
    "regencyId": "r-btu-kota",
    "name": "Junrejo",
    "lat": -7.8931,
    "lng": 112.5539,
    "postalCode": "65321"
  },
  {
    "id": "d-kdrk-kota",
    "regencyId": "r-kdr-kota",
    "name": "Kota Kediri",
    "lat": -7.8167,
    "lng": 112.0167,
    "postalCode": "64129"
  },
  {
    "id": "d-kdrk-mojoroto",
    "regencyId": "r-kdr-kota",
    "name": "Mojoroto",
    "lat": -7.8083,
    "lng": 111.9889,
    "postalCode": "64112"
  },
  {
    "id": "d-kdrk-pesantren",
    "regencyId": "r-kdr-kota",
    "name": "Pesantren",
    "lat": -7.8333,
    "lng": 112.05,
    "postalCode": "64131"
  },
  {
    "id": "d-bltk-kepanjenkidul",
    "regencyId": "r-blt-kota",
    "name": "Kepanjenkidul",
    "lat": -8.0944,
    "lng": 112.1639,
    "postalCode": "66117"
  },
  {
    "id": "d-bltk-sananwetan",
    "regencyId": "r-blt-kota",
    "name": "Sananwetan",
    "lat": -8.1056,
    "lng": 112.1833,
    "postalCode": "66137"
  },
  {
    "id": "d-bltk-sukorejo",
    "regencyId": "r-blt-kota",
    "name": "Sukorejo",
    "lat": -8.1111,
    "lng": 112.1528,
    "postalCode": "66121"
  },
  {
    "id": "d-mdnk-kartoharjo",
    "regencyId": "r-mdn-kota-jatim",
    "name": "Kartoharjo",
    "lat": -7.6256,
    "lng": 111.5333,
    "postalCode": "63117"
  },
  {
    "id": "d-mdnk-manguharjo",
    "regencyId": "r-mdn-kota-jatim",
    "name": "Manguharjo",
    "lat": -7.6278,
    "lng": 111.5167,
    "postalCode": "63124"
  },
  {
    "id": "d-mdnk-taman",
    "regencyId": "r-mdn-kota-jatim",
    "name": "Taman",
    "lat": -7.6444,
    "lng": 111.5278,
    "postalCode": "63131"
  },
  {
    "id": "d-mjkk-magersari",
    "regencyId": "r-mjk-kota",
    "name": "Magersari",
    "lat": -7.4667,
    "lng": 112.4417,
    "postalCode": "61314"
  },
  {
    "id": "d-mjkk-prajuritkulon",
    "regencyId": "r-mjk-kota",
    "name": "Prajurit Kulon",
    "lat": -7.4722,
    "lng": 112.4278,
    "postalCode": "61321"
  },
  {
    "id": "d-mjkk-kranggan",
    "regencyId": "r-mjk-kota",
    "name": "Kranggan",
    "lat": -7.4789,
    "lng": 112.4389,
    "postalCode": "61324"
  },
  {
    "id": "d-psrk-purworejo",
    "regencyId": "r-psr-kota",
    "name": "Purworejo",
    "lat": -7.6444,
    "lng": 112.9056,
    "postalCode": "67115"
  },
  {
    "id": "d-psrk-bugulkidul",
    "regencyId": "r-psr-kota",
    "name": "Bugul Kidul",
    "lat": -7.6583,
    "lng": 112.9222,
    "postalCode": "67129"
  },
  {
    "id": "d-psrk-gadingrejo",
    "regencyId": "r-psr-kota",
    "name": "Gadingrejo",
    "lat": -7.6333,
    "lng": 112.8833,
    "postalCode": "67134"
  },
  {
    "id": "d-psrk-panggungrejo",
    "regencyId": "r-psr-kota",
    "name": "Panggungrejo",
    "lat": -7.6389,
    "lng": 112.9111,
    "postalCode": "67126"
  },
  {
    "id": "d-prbk-kanigaran",
    "regencyId": "r-prb-kota",
    "name": "Kanigaran",
    "lat": -7.7556,
    "lng": 113.2167,
    "postalCode": "67213"
  },
  {
    "id": "d-prbk-mayangan",
    "regencyId": "r-prb-kota",
    "name": "Mayangan",
    "lat": -7.7444,
    "lng": 113.2222,
    "postalCode": "67211"
  },
  {
    "id": "d-prbk-wonoasih",
    "regencyId": "r-prb-kota",
    "name": "Wonoasih",
    "lat": -7.7889,
    "lng": 113.2,
    "postalCode": "67231"
  },
  {
    "id": "d-prbk-kedopok",
    "regencyId": "r-prb-kota",
    "name": "Kedopok",
    "lat": -7.7722,
    "lng": 113.2083,
    "postalCode": "67228"
  },
  {
    "id": "d-prbk-kademangan",
    "regencyId": "r-prb-kota",
    "name": "Kademangan",
    "lat": -7.7833,
    "lng": 113.1833,
    "postalCode": "67225"
  },
  {
    "id": "d-sda-sidoarjo",
    "regencyId": "r-sda-kab",
    "name": "Sidoarjo (Pusat)",
    "lat": -7.4478,
    "lng": 112.7183,
    "postalCode": "61212"
  },
  {
    "id": "d-sda-buduran",
    "regencyId": "r-sda-kab",
    "name": "Buduran",
    "lat": -7.4222,
    "lng": 112.7278,
    "postalCode": "61252"
  },
  {
    "id": "d-sda-candi",
    "regencyId": "r-sda-kab",
    "name": "Candi",
    "lat": -7.4811,
    "lng": 112.7167,
    "postalCode": "61271"
  },
  {
    "id": "d-sda-porong",
    "regencyId": "r-sda-kab",
    "name": "Porong",
    "lat": -7.5389,
    "lng": 112.6972,
    "postalCode": "61274"
  },
  {
    "id": "d-sda-krembung",
    "regencyId": "r-sda-kab",
    "name": "Krembung",
    "lat": -7.525,
    "lng": 112.6167,
    "postalCode": "61275"
  },
  {
    "id": "d-sda-tulangan",
    "regencyId": "r-sda-kab",
    "name": "Tulangan",
    "lat": -7.4833,
    "lng": 112.65,
    "postalCode": "61273"
  },
  {
    "id": "d-sda-tanggulangin",
    "regencyId": "r-sda-kab",
    "name": "Tanggulangin",
    "lat": -7.5083,
    "lng": 112.7083,
    "postalCode": "61272"
  },
  {
    "id": "d-sda-jabon",
    "regencyId": "r-sda-kab",
    "name": "Jabon",
    "lat": -7.5667,
    "lng": 112.75,
    "postalCode": "61276"
  },
  {
    "id": "d-sda-krian",
    "regencyId": "r-sda-kab",
    "name": "Krian",
    "lat": -7.4117,
    "lng": 112.5856,
    "postalCode": "61262"
  },
  {
    "id": "d-sda-balongbendo",
    "regencyId": "r-sda-kab",
    "name": "Balongbendo",
    "lat": -7.4083,
    "lng": 112.5333,
    "postalCode": "61263"
  },
  {
    "id": "d-sda-wonoayu",
    "regencyId": "r-sda-kab",
    "name": "Wonoayu",
    "lat": -7.4333,
    "lng": 112.6333,
    "postalCode": "61261"
  },
  {
    "id": "d-sda-tarik",
    "regencyId": "r-sda-kab",
    "name": "Tarik",
    "lat": -7.4583,
    "lng": 112.5,
    "postalCode": "61265"
  },
  {
    "id": "d-sda-prambon",
    "regencyId": "r-sda-kab",
    "name": "Prambon",
    "lat": -7.475,
    "lng": 112.5667,
    "postalCode": "61264"
  },
  {
    "id": "d-sda-taman",
    "regencyId": "r-sda-kab",
    "name": "Taman (Sepanjang)",
    "lat": -7.3606,
    "lng": 112.6897,
    "postalCode": "61257"
  },
  {
    "id": "d-sda-waru",
    "regencyId": "r-sda-kab",
    "name": "Waru (Bungurasih)",
    "lat": -7.3556,
    "lng": 112.7417,
    "postalCode": "61256"
  },
  {
    "id": "d-sda-gedangan",
    "regencyId": "r-sda-kab",
    "name": "Gedangan",
    "lat": -7.3889,
    "lng": 112.7306,
    "postalCode": "61254"
  },
  {
    "id": "d-sda-sedati",
    "regencyId": "r-sda-kab",
    "name": "Sedati (Bandara Juanda)",
    "lat": -7.375,
    "lng": 112.775,
    "postalCode": "61253"
  },
  {
    "id": "d-sda-sukodono",
    "regencyId": "r-sda-kab",
    "name": "Sukodono",
    "lat": -7.4194,
    "lng": 112.6778,
    "postalCode": "61258"
  },
  {
    "id": "d-grk-gresik",
    "regencyId": "r-grk-kab",
    "name": "Gresik (Kota)",
    "lat": -7.1567,
    "lng": 112.6556,
    "postalCode": "61114"
  },
  {
    "id": "d-grk-kebomas",
    "regencyId": "r-grk-kab",
    "name": "Kebomas",
    "lat": -7.1722,
    "lng": 112.6289,
    "postalCode": "61121"
  },
  {
    "id": "d-grk-manyar",
    "regencyId": "r-grk-kab",
    "name": "Manyar (JIIPE)",
    "lat": -7.1194,
    "lng": 112.6056,
    "postalCode": "61151"
  },
  {
    "id": "d-grk-cerme",
    "regencyId": "r-grk-kab",
    "name": "Cerme",
    "lat": -7.2194,
    "lng": 112.5583,
    "postalCode": "61171"
  },
  {
    "id": "d-grk-menganti",
    "regencyId": "r-grk-kab",
    "name": "Menganti",
    "lat": -7.2889,
    "lng": 112.5889,
    "postalCode": "61174"
  },
  {
    "id": "d-grk-driyorejo",
    "regencyId": "r-grk-kab",
    "name": "Driyorejo",
    "lat": -7.3486,
    "lng": 112.6167,
    "postalCode": "61177"
  },
  {
    "id": "d-grk-kedamean",
    "regencyId": "r-grk-kab",
    "name": "Kedamean",
    "lat": -7.3167,
    "lng": 112.55,
    "postalCode": "61175"
  },
  {
    "id": "d-grk-wringinanom",
    "regencyId": "r-grk-kab",
    "name": "Wringinanom",
    "lat": -7.3833,
    "lng": 112.5333,
    "postalCode": "61176"
  },
  {
    "id": "d-grk-duduksampeyan",
    "regencyId": "r-grk-kab",
    "name": "Duduksampeyan",
    "lat": -7.1667,
    "lng": 112.5333,
    "postalCode": "61162"
  },
  {
    "id": "d-grk-benjeng",
    "regencyId": "r-grk-kab",
    "name": "Benjeng",
    "lat": -7.25,
    "lng": 112.4833,
    "postalCode": "61172"
  },
  {
    "id": "d-grk-balongpanggang",
    "regencyId": "r-grk-kab",
    "name": "Balongpanggang",
    "lat": -7.2833,
    "lng": 112.4333,
    "postalCode": "61173"
  },
  {
    "id": "d-grk-bungah",
    "regencyId": "r-grk-kab",
    "name": "Bungah",
    "lat": -7.05,
    "lng": 112.5667,
    "postalCode": "61152"
  },
  {
    "id": "d-grk-sidayu",
    "regencyId": "r-grk-kab",
    "name": "Sidayu",
    "lat": -7,
    "lng": 112.5667,
    "postalCode": "61153"
  },
  {
    "id": "d-grk-dukun",
    "regencyId": "r-grk-kab",
    "name": "Dukun",
    "lat": -7.0167,
    "lng": 112.4833,
    "postalCode": "61155"
  },
  {
    "id": "d-grk-panceng",
    "regencyId": "r-grk-kab",
    "name": "Panceng",
    "lat": -6.9333,
    "lng": 112.4667,
    "postalCode": "61156"
  },
  {
    "id": "d-grk-ujungpangkah",
    "regencyId": "r-grk-kab",
    "name": "Ujungpangkah",
    "lat": -6.8833,
    "lng": 112.55,
    "postalCode": "61154"
  },
  {
    "id": "d-grk-sangkapura",
    "regencyId": "r-grk-kab",
    "name": "Sangkapura (Bawean)",
    "lat": -5.85,
    "lng": 112.65,
    "postalCode": "61181"
  },
  {
    "id": "d-grk-tambak",
    "regencyId": "r-grk-kab",
    "name": "Tambak (Bawean)",
    "lat": -5.7667,
    "lng": 112.6667,
    "postalCode": "61182"
  },
  {
    "id": "d-bkl-bangkalan",
    "regencyId": "r-bkl-kab",
    "name": "Bangkalan (Kota)",
    "lat": -7.0306,
    "lng": 112.7472,
    "postalCode": "69112"
  },
  {
    "id": "d-bkl-kamal",
    "regencyId": "r-bkl-kab",
    "name": "Kamal (Pelabuhan)",
    "lat": -7.1667,
    "lng": 112.7167,
    "postalCode": "69162"
  },
  {
    "id": "d-bkl-labang",
    "regencyId": "r-bkl-kab",
    "name": "Labang (Jembatan Suramadu)",
    "lat": -7.1833,
    "lng": 112.7667,
    "postalCode": "69163"
  },
  {
    "id": "d-bkl-burneh",
    "regencyId": "r-bkl-kab",
    "name": "Burneh",
    "lat": -7.0667,
    "lng": 112.7667,
    "postalCode": "69121"
  },
  {
    "id": "d-bkl-socah",
    "regencyId": "r-bkl-kab",
    "name": "Socah",
    "lat": -7.1,
    "lng": 112.7333,
    "postalCode": "69161"
  },
  {
    "id": "d-bkl-arosbaya",
    "regencyId": "r-bkl-kab",
    "name": "Arosbaya",
    "lat": -6.95,
    "lng": 112.8333,
    "postalCode": "69151"
  },
  {
    "id": "d-bkl-klampis",
    "regencyId": "r-bkl-kab",
    "name": "Klampis",
    "lat": -6.9167,
    "lng": 112.8833,
    "postalCode": "69153"
  },
  {
    "id": "d-bkl-sepulu",
    "regencyId": "r-bkl-kab",
    "name": "Sepulu",
    "lat": -6.9,
    "lng": 113,
    "postalCode": "69154"
  },
  {
    "id": "d-bkl-tanjungbumi",
    "regencyId": "r-bkl-kab",
    "name": "Tanjung Bumi",
    "lat": -6.8833,
    "lng": 113.1,
    "postalCode": "69156"
  },
  {
    "id": "d-bkl-kokop",
    "regencyId": "r-bkl-kab",
    "name": "Kokop",
    "lat": -7,
    "lng": 113.0333,
    "postalCode": "69155"
  },
  {
    "id": "d-bkl-geger",
    "regencyId": "r-bkl-kab",
    "name": "Geger",
    "lat": -7.0333,
    "lng": 112.9333,
    "postalCode": "69152"
  },
  {
    "id": "d-bkl-galis",
    "regencyId": "r-bkl-kab",
    "name": "Galis",
    "lat": -7.1,
    "lng": 112.9333,
    "postalCode": "69173"
  },
  {
    "id": "d-bkl-blega",
    "regencyId": "r-bkl-kab",
    "name": "Blega",
    "lat": -7.15,
    "lng": 113.0333,
    "postalCode": "69174"
  },
  {
    "id": "d-bkl-modung",
    "regencyId": "r-bkl-kab",
    "name": "Modung",
    "lat": -7.2,
    "lng": 112.9833,
    "postalCode": "69175"
  },
  {
    "id": "d-bkl-kwanyar",
    "regencyId": "r-bkl-kab",
    "name": "Kwanyar",
    "lat": -7.1833,
    "lng": 112.8667,
    "postalCode": "69171"
  },
  {
    "id": "d-bkl-tragah",
    "regencyId": "r-bkl-kab",
    "name": "Tragah",
    "lat": -7.1167,
    "lng": 112.8,
    "postalCode": "69172"
  },
  {
    "id": "d-bkl-tanahmerah",
    "regencyId": "r-bkl-kab",
    "name": "Tanah Merah",
    "lat": -7.0833,
    "lng": 112.8667,
    "postalCode": "69172"
  },
  {
    "id": "d-bkl-konang",
    "regencyId": "r-bkl-kab",
    "name": "Konang",
    "lat": -7.0833,
    "lng": 113.0833,
    "postalCode": "69175"
  },
  {
    "id": "d-byw-banyuwangi",
    "regencyId": "r-byw-kab",
    "name": "Banyuwangi (Kota)",
    "lat": -8.2192,
    "lng": 114.3692,
    "postalCode": "68411"
  },
  {
    "id": "d-byw-giri",
    "regencyId": "r-byw-kab",
    "name": "Giri",
    "lat": -8.1972,
    "lng": 114.3528,
    "postalCode": "68423"
  },
  {
    "id": "d-byw-glagah",
    "regencyId": "r-byw-kab",
    "name": "Glagah",
    "lat": -8.2167,
    "lng": 114.3167,
    "postalCode": "68432"
  },
  {
    "id": "d-byw-licin",
    "regencyId": "r-byw-kab",
    "name": "Licin (Kawah Ijen)",
    "lat": -8.2167,
    "lng": 114.25,
    "postalCode": "68454"
  },
  {
    "id": "d-byw-kalipuro",
    "regencyId": "r-byw-kab",
    "name": "Kalipuro (Ketapang)",
    "lat": -8.1333,
    "lng": 114.3833,
    "postalCode": "68455"
  },
  {
    "id": "d-byw-wongsorejo",
    "regencyId": "r-byw-kab",
    "name": "Wongsorejo",
    "lat": -7.9833,
    "lng": 114.4,
    "postalCode": "68453"
  },
  {
    "id": "d-byw-kabat",
    "regencyId": "r-byw-kab",
    "name": "Kabat",
    "lat": -8.2667,
    "lng": 114.3333,
    "postalCode": "68461"
  },
  {
    "id": "d-byw-rogojampi",
    "regencyId": "r-byw-kab",
    "name": "Rogojampi",
    "lat": -8.3056,
    "lng": 114.2944,
    "postalCode": "68462"
  },
  {
    "id": "d-byw-blimbingsari",
    "regencyId": "r-byw-kab",
    "name": "Blimbingsari (Bandara)",
    "lat": -8.3167,
    "lng": 114.35,
    "postalCode": "68462"
  },
  {
    "id": "d-byw-singojuruh",
    "regencyId": "r-byw-kab",
    "name": "Singojuruh",
    "lat": -8.3167,
    "lng": 114.2333,
    "postalCode": "68464"
  },
  {
    "id": "d-byw-sempu",
    "regencyId": "r-byw-kab",
    "name": "Sempu",
    "lat": -8.35,
    "lng": 114.15,
    "postalCode": "68468"
  },
  {
    "id": "d-byw-songgon",
    "regencyId": "r-byw-kab",
    "name": "Songgon",
    "lat": -8.2667,
    "lng": 114.2,
    "postalCode": "68463"
  },
  {
    "id": "d-byw-genteng",
    "regencyId": "r-byw-kab",
    "name": "Genteng",
    "lat": -8.3667,
    "lng": 114.15,
    "postalCode": "68465"
  },
  {
    "id": "d-byw-glenmore",
    "regencyId": "r-byw-kab",
    "name": "Glenmore",
    "lat": -8.3167,
    "lng": 114.05,
    "postalCode": "68466"
  },
  {
    "id": "d-byw-kalibaru",
    "regencyId": "r-byw-kab",
    "name": "Kalibaru",
    "lat": -8.2833,
    "lng": 113.9833,
    "postalCode": "68467"
  },
  {
    "id": "d-byw-srono",
    "regencyId": "r-byw-kab",
    "name": "Srono",
    "lat": -8.3833,
    "lng": 114.2667,
    "postalCode": "68471"
  },
  {
    "id": "d-byw-cluring",
    "regencyId": "r-byw-kab",
    "name": "Cluring",
    "lat": -8.4333,
    "lng": 114.2167,
    "postalCode": "68482"
  },
  {
    "id": "d-byw-gambiran",
    "regencyId": "r-byw-kab",
    "name": "Gambiran",
    "lat": -8.4,
    "lng": 114.1333,
    "postalCode": "68486"
  },
  {
    "id": "d-byw-tegalsari",
    "regencyId": "r-byw-kab",
    "name": "Tegalsari",
    "lat": -8.45,
    "lng": 114.1167,
    "postalCode": "68485"
  },
  {
    "id": "d-byw-bangorejo",
    "regencyId": "r-byw-kab",
    "name": "Bangorejo",
    "lat": -8.4833,
    "lng": 114.1833,
    "postalCode": "68487"
  },
  {
    "id": "d-byw-purwoharjo",
    "regencyId": "r-byw-kab",
    "name": "Purwoharjo",
    "lat": -8.5167,
    "lng": 114.2333,
    "postalCode": "68483"
  },
  {
    "id": "d-byw-tegaldlimo",
    "regencyId": "r-byw-kab",
    "name": "Tegaldlimo (Alas Purwo)",
    "lat": -8.5667,
    "lng": 114.3167,
    "postalCode": "68484"
  },
  {
    "id": "d-byw-muncar",
    "regencyId": "r-byw-kab",
    "name": "Muncar (Pelabuhan Ikan)",
    "lat": -8.4333,
    "lng": 114.3333,
    "postalCode": "68472"
  },
  {
    "id": "d-byw-pesanggaran",
    "regencyId": "r-byw-kab",
    "name": "Pesanggaran (Pulau Merah)",
    "lat": -8.55,
    "lng": 114.05,
    "postalCode": "68488"
  },
  {
    "id": "d-byw-siliragung",
    "regencyId": "r-byw-kab",
    "name": "Siliragung",
    "lat": -8.5333,
    "lng": 114.1167,
    "postalCode": "68488"
  },
  {
    "id": "d-bltb-kanigoro",
    "regencyId": "r-blt-kab",
    "name": "Kanigoro (Pemkab)",
    "lat": -8.1333,
    "lng": 112.2167,
    "postalCode": "66171"
  },
  {
    "id": "d-bltb-garum",
    "regencyId": "r-blt-kab",
    "name": "Garum",
    "lat": -8.0694,
    "lng": 112.2278,
    "postalCode": "66182"
  },
  {
    "id": "d-bltb-talun",
    "regencyId": "r-blt-kab",
    "name": "Talun",
    "lat": -8.0833,
    "lng": 112.2833,
    "postalCode": "66183"
  },
  {
    "id": "d-bltb-wlingi",
    "regencyId": "r-blt-kab",
    "name": "Wlingi",
    "lat": -8.0833,
    "lng": 112.3167,
    "postalCode": "66184"
  },
  {
    "id": "d-bltb-doko",
    "regencyId": "r-blt-kab",
    "name": "Doko",
    "lat": -8.0167,
    "lng": 112.3667,
    "postalCode": "66186"
  },
  {
    "id": "d-bltb-kesamben",
    "regencyId": "r-blt-kab",
    "name": "Kesamben",
    "lat": -8.1333,
    "lng": 112.3667,
    "postalCode": "66191"
  },
  {
    "id": "d-bltb-selorejo",
    "regencyId": "r-blt-kab",
    "name": "Selorejo",
    "lat": -8.1167,
    "lng": 112.4333,
    "postalCode": "66192"
  },
  {
    "id": "d-bltb-gandusari",
    "regencyId": "r-blt-kab",
    "name": "Gandusari",
    "lat": -8,
    "lng": 112.3,
    "postalCode": "66187"
  },
  {
    "id": "d-bltb-nglegok",
    "regencyId": "r-blt-kab",
    "name": "Nglegok (Candi Penataran)",
    "lat": -8.0167,
    "lng": 112.2167,
    "postalCode": "66181"
  },
  {
    "id": "d-bltb-srengat",
    "regencyId": "r-blt-kab",
    "name": "Srengat",
    "lat": -8.0667,
    "lng": 112.0667,
    "postalCode": "66152"
  },
  {
    "id": "d-bltb-ponggok",
    "regencyId": "r-blt-kab",
    "name": "Ponggok",
    "lat": -8.0333,
    "lng": 112.1167,
    "postalCode": "66153"
  },
  {
    "id": "d-bltb-sanankulon",
    "regencyId": "r-blt-kab",
    "name": "Sanankulon",
    "lat": -8.1167,
    "lng": 112.1333,
    "postalCode": "66151"
  },
  {
    "id": "d-bltb-wonodadi",
    "regencyId": "r-blt-kab",
    "name": "Wonodadi",
    "lat": -8.0333,
    "lng": 112.0167,
    "postalCode": "66155"
  },
  {
    "id": "d-bltb-udanawu",
    "regencyId": "r-blt-kab",
    "name": "Udanawu",
    "lat": -7.9833,
    "lng": 112.05,
    "postalCode": "66154"
  },
  {
    "id": "d-bltb-kademangan",
    "regencyId": "r-blt-kab",
    "name": "Kademangan",
    "lat": -8.1667,
    "lng": 112.1333,
    "postalCode": "66161"
  },
  {
    "id": "d-bltb-sutojayan",
    "regencyId": "r-blt-kab",
    "name": "Sutojayan (Lodoyo)",
    "lat": -8.1889,
    "lng": 112.2194,
    "postalCode": "66172"
  },
  {
    "id": "d-bltb-panggungrejo",
    "regencyId": "r-blt-kab",
    "name": "Panggungrejo",
    "lat": -8.2833,
    "lng": 112.2333,
    "postalCode": "66174"
  },
  {
    "id": "d-bltb-binangun",
    "regencyId": "r-blt-kab",
    "name": "Binangun",
    "lat": -8.2333,
    "lng": 112.35,
    "postalCode": "66193"
  },
  {
    "id": "d-bltb-wates",
    "regencyId": "r-blt-kab",
    "name": "Wates",
    "lat": -8.2667,
    "lng": 112.4167,
    "postalCode": "66194"
  },
  {
    "id": "d-bltb-bakung",
    "regencyId": "r-blt-kab",
    "name": "Bakung",
    "lat": -8.2667,
    "lng": 112.0833,
    "postalCode": "66163"
  },
  {
    "id": "d-bltb-wonotirto",
    "regencyId": "r-blt-kab",
    "name": "Wonotirto (Tambakrejo)",
    "lat": -8.2833,
    "lng": 112.1667,
    "postalCode": "66173"
  },
  {
    "id": "d-bltb-selopuro",
    "regencyId": "r-blt-kab",
    "name": "Selopuro",
    "lat": -8.1333,
    "lng": 112.3,
    "postalCode": "66185"
  },
  {
    "id": "d-bjn-bojonegoro",
    "regencyId": "r-bjn-kab",
    "name": "Bojonegoro (Kota)",
    "lat": -7.15,
    "lng": 111.8817,
    "postalCode": "62111"
  },
  {
    "id": "d-bjn-dander",
    "regencyId": "r-bjn-kab",
    "name": "Dander",
    "lat": -7.25,
    "lng": 111.85,
    "postalCode": "62171"
  },
  {
    "id": "d-bjn-kapas",
    "regencyId": "r-bjn-kab",
    "name": "Kapas",
    "lat": -7.1833,
    "lng": 111.9167,
    "postalCode": "62181"
  },
  {
    "id": "d-bjn-balen",
    "regencyId": "r-bjn-kab",
    "name": "Balen",
    "lat": -7.1667,
    "lng": 111.9833,
    "postalCode": "62182"
  },
  {
    "id": "d-bjn-sumberejo",
    "regencyId": "r-bjn-kab",
    "name": "Sumberejo",
    "lat": -7.15,
    "lng": 112.0167,
    "postalCode": "62191"
  },
  {
    "id": "d-bjn-baureno",
    "regencyId": "r-bjn-kab",
    "name": "Baureno",
    "lat": -7.1333,
    "lng": 112.1,
    "postalCode": "62192"
  },
  {
    "id": "d-bjn-kanor",
    "regencyId": "r-bjn-kab",
    "name": "Kanor",
    "lat": -7.1,
    "lng": 112.05,
    "postalCode": "62193"
  },
  {
    "id": "d-bjn-kedungadem",
    "regencyId": "r-bjn-kab",
    "name": "Kedungadem",
    "lat": -7.2833,
    "lng": 112.0333,
    "postalCode": "62195"
  },
  {
    "id": "d-bjn-kepohbaru",
    "regencyId": "r-bjn-kab",
    "name": "Kepohbaru",
    "lat": -7.2333,
    "lng": 112.0833,
    "postalCode": "62194"
  },
  {
    "id": "d-bjn-kalitidu",
    "regencyId": "r-bjn-kab",
    "name": "Kalitidu",
    "lat": -7.1417,
    "lng": 111.7583,
    "postalCode": "62152"
  },
  {
    "id": "d-bjn-gayam",
    "regencyId": "r-bjn-kab",
    "name": "Gayam (Blok Cepu)",
    "lat": -7.1833,
    "lng": 111.7,
    "postalCode": "62156"
  },
  {
    "id": "d-bjn-padangan",
    "regencyId": "r-bjn-kab",
    "name": "Padangan",
    "lat": -7.1583,
    "lng": 111.6167,
    "postalCode": "62162"
  },
  {
    "id": "d-bjn-kasiman",
    "regencyId": "r-bjn-kab",
    "name": "Kasiman",
    "lat": -7.1,
    "lng": 111.6333,
    "postalCode": "62164"
  },
  {
    "id": "d-bjn-kedewan",
    "regencyId": "r-bjn-kab",
    "name": "Kedewan",
    "lat": -7.05,
    "lng": 111.65,
    "postalCode": "62163"
  },
  {
    "id": "d-bjn-malo",
    "regencyId": "r-bjn-kab",
    "name": "Malo",
    "lat": -7.1167,
    "lng": 111.7333,
    "postalCode": "62154"
  },
  {
    "id": "d-bjn-ngraho",
    "regencyId": "r-bjn-kab",
    "name": "Ngraho",
    "lat": -7.2667,
    "lng": 111.5333,
    "postalCode": "62165"
  },
  {
    "id": "d-bjn-margomulyo",
    "regencyId": "r-bjn-kab",
    "name": "Margomulyo",
    "lat": -7.3667,
    "lng": 111.5333,
    "postalCode": "62168"
  },
  {
    "id": "d-bjn-tambakrejo",
    "regencyId": "r-bjn-kab",
    "name": "Tambakrejo",
    "lat": -7.25,
    "lng": 111.65,
    "postalCode": "62166"
  },
  {
    "id": "d-bjn-ngambon",
    "regencyId": "r-bjn-kab",
    "name": "Ngambon",
    "lat": -7.3,
    "lng": 111.7167,
    "postalCode": "62167"
  },
  {
    "id": "d-bjn-ngasem",
    "regencyId": "r-bjn-kab",
    "name": "Ngasem",
    "lat": -7.2333,
    "lng": 111.75,
    "postalCode": "62173"
  },
  {
    "id": "d-bjn-bubulan",
    "regencyId": "r-bjn-kab",
    "name": "Bubulan",
    "lat": -7.3333,
    "lng": 111.8333,
    "postalCode": "62172"
  },
  {
    "id": "d-bjn-sekar",
    "regencyId": "r-bjn-kab",
    "name": "Sekar",
    "lat": -7.4167,
    "lng": 111.7833,
    "postalCode": "62174"
  },
  {
    "id": "d-bjn-gondang",
    "regencyId": "r-bjn-kab",
    "name": "Gondang",
    "lat": -7.4,
    "lng": 111.8667,
    "postalCode": "62175"
  },
  {
    "id": "d-bjn-temayang",
    "regencyId": "r-bjn-kab",
    "name": "Temayang",
    "lat": -7.3333,
    "lng": 111.9,
    "postalCode": "62184"
  },
  {
    "id": "d-bjn-sugihwaras",
    "regencyId": "r-bjn-kab",
    "name": "Sugihwaras",
    "lat": -7.3167,
    "lng": 111.9667,
    "postalCode": "62183"
  },
  {
    "id": "d-bjn-sukosewu",
    "regencyId": "r-bjn-kab",
    "name": "Sukosewu",
    "lat": -7.25,
    "lng": 111.95,
    "postalCode": "62185"
  },
  {
    "id": "d-bjn-trucuk",
    "regencyId": "r-bjn-kab",
    "name": "Trucuk",
    "lat": -7.1333,
    "lng": 111.8667,
    "postalCode": "62155"
  },
  {
    "id": "d-bjn-purwosari",
    "regencyId": "r-bjn-kab",
    "name": "Purwosari",
    "lat": -7.1667,
    "lng": 111.6833,
    "postalCode": "62161"
  },
  {
    "id": "d-bdw-bondowoso",
    "regencyId": "r-bdw-kab",
    "name": "Bondowoso (Kota)",
    "lat": -7.9139,
    "lng": 113.8222,
    "postalCode": "68211"
  },
  {
    "id": "d-bdw-curahdami",
    "regencyId": "r-bdw-kab",
    "name": "Curahdami",
    "lat": -7.9167,
    "lng": 113.7833,
    "postalCode": "68251"
  },
  {
    "id": "d-bdw-tenggarang",
    "regencyId": "r-bdw-kab",
    "name": "Tenggarang",
    "lat": -7.9333,
    "lng": 113.8667,
    "postalCode": "68281"
  },
  {
    "id": "d-bdw-wonosari",
    "regencyId": "r-bdw-kab",
    "name": "Wonosari",
    "lat": -7.95,
    "lng": 113.9167,
    "postalCode": "68282"
  },
  {
    "id": "d-bdw-tapen",
    "regencyId": "r-bdw-kab",
    "name": "Tapen",
    "lat": -7.9,
    "lng": 113.95,
    "postalCode": "68283"
  },
  {
    "id": "d-bdw-krosok",
    "regencyId": "r-bdw-kab",
    "name": "Taman Krocok",
    "lat": -7.8667,
    "lng": 113.8833,
    "postalCode": "68261"
  },
  {
    "id": "d-bdw-tegalampel",
    "regencyId": "r-bdw-kab",
    "name": "Tegalampel",
    "lat": -7.8667,
    "lng": 113.8333,
    "postalCode": "68271"
  },
  {
    "id": "d-bdw-wringin",
    "regencyId": "r-bdw-kab",
    "name": "Wringin",
    "lat": -7.8333,
    "lng": 113.75,
    "postalCode": "68252"
  },
  {
    "id": "d-bdw-prajekan",
    "regencyId": "r-bdw-kab",
    "name": "Prajekan",
    "lat": -7.8,
    "lng": 113.9833,
    "postalCode": "68284"
  },
  {
    "id": "d-bdw-cermee",
    "regencyId": "r-bdw-kab",
    "name": "Cermee",
    "lat": -7.85,
    "lng": 114.05,
    "postalCode": "68286"
  },
  {
    "id": "d-bdw-botolinggo",
    "regencyId": "r-bdw-kab",
    "name": "Botolinggo",
    "lat": -7.8167,
    "lng": 114.0167,
    "postalCode": "68284"
  },
  {
    "id": "d-bdw-klabang",
    "regencyId": "r-bdw-kab",
    "name": "Klabang",
    "lat": -7.85,
    "lng": 113.9333,
    "postalCode": "68284"
  },
  {
    "id": "d-bdw-sukosari",
    "regencyId": "r-bdw-kab",
    "name": "Sukosari",
    "lat": -7.9833,
    "lng": 114.05,
    "postalCode": "68287"
  },
  {
    "id": "d-bdw-sumberwringin",
    "regencyId": "r-bdw-kab",
    "name": "Sumberwringin",
    "lat": -8,
    "lng": 114.0833,
    "postalCode": "68287"
  },
  {
    "id": "d-bdw-ijen",
    "regencyId": "r-bdw-kab",
    "name": "Ijen (Sempol Kawah Ijen)",
    "lat": -8.05,
    "lng": 114.15,
    "postalCode": "68288"
  },
  {
    "id": "d-bdw-grujugan",
    "regencyId": "r-bdw-kab",
    "name": "Grujugan",
    "lat": -7.9833,
    "lng": 113.7833,
    "postalCode": "68261"
  },
  {
    "id": "d-bdw-maesan",
    "regencyId": "r-bdw-kab",
    "name": "Maesan",
    "lat": -8.0333,
    "lng": 113.8,
    "postalCode": "68262"
  },
  {
    "id": "d-bdw-tamanan",
    "regencyId": "r-bdw-kab",
    "name": "Tamanan",
    "lat": -8,
    "lng": 113.8333,
    "postalCode": "68263"
  },
  {
    "id": "d-bdw-jambesari",
    "regencyId": "r-bdw-kab",
    "name": "Jambesari Darus Sholah",
    "lat": -7.9667,
    "lng": 113.8167,
    "postalCode": "68263"
  },
  {
    "id": "d-bdw-pujer",
    "regencyId": "r-bdw-kab",
    "name": "Pujer",
    "lat": -7.9833,
    "lng": 113.8833,
    "postalCode": "68271"
  },
  {
    "id": "d-bdw-tlogosari",
    "regencyId": "r-bdw-kab",
    "name": "Tlogosari",
    "lat": -8,
    "lng": 113.9333,
    "postalCode": "68272"
  },
  {
    "id": "d-bdw-binakal",
    "regencyId": "r-bdw-kab",
    "name": "Binakal",
    "lat": -7.9,
    "lng": 113.7333,
    "postalCode": "68251"
  },
  {
    "id": "d-bdw-pakem",
    "regencyId": "r-bdw-kab",
    "name": "Pakem",
    "lat": -7.9,
    "lng": 113.6833,
    "postalCode": "68253"
  },
  {
    "id": "d-jbr-kaliwates",
    "regencyId": "r-jbr-kab",
    "name": "Kaliwates (Kota Jember)",
    "lat": -8.175,
    "lng": 113.6861,
    "postalCode": "68131"
  },
  {
    "id": "d-jbr-sumbersari",
    "regencyId": "r-jbr-kab",
    "name": "Sumbersari (Kampus UNEJ)",
    "lat": -8.1694,
    "lng": 113.7222,
    "postalCode": "68121"
  },
  {
    "id": "d-jbr-patrang",
    "regencyId": "r-jbr-kab",
    "name": "Patrang",
    "lat": -8.1472,
    "lng": 113.7111,
    "postalCode": "68111"
  },
  {
    "id": "d-jbr-sukorambi",
    "regencyId": "r-jbr-kab",
    "name": "Sukorambi",
    "lat": -8.1417,
    "lng": 113.65,
    "postalCode": "68151"
  },
  {
    "id": "d-jbr-panti",
    "regencyId": "r-jbr-kab",
    "name": "Panti",
    "lat": -8.1167,
    "lng": 113.6,
    "postalCode": "68153"
  },
  {
    "id": "d-jbr-mangli",
    "regencyId": "r-jbr-kab",
    "name": "Ajung",
    "lat": -8.2333,
    "lng": 113.6667,
    "postalCode": "68175"
  },
  {
    "id": "d-jbr-mumbulsari",
    "regencyId": "r-jbr-kab",
    "name": "Mumbulsari",
    "lat": -8.2667,
    "lng": 113.7333,
    "postalCode": "68174"
  },
  {
    "id": "d-jbr-jenggawah",
    "regencyId": "r-jbr-kab",
    "name": "Jenggawah",
    "lat": -8.2833,
    "lng": 113.6667,
    "postalCode": "68171"
  },
  {
    "id": "d-jbr-ambulu",
    "regencyId": "r-jbr-kab",
    "name": "Ambulu (Papuma)",
    "lat": -8.3583,
    "lng": 113.6083,
    "postalCode": "68172"
  },
  {
    "id": "d-jbr-tempurejo",
    "regencyId": "r-jbr-kab",
    "name": "Tempurejo (Bandealit)",
    "lat": -8.3667,
    "lng": 113.75,
    "postalCode": "68173"
  },
  {
    "id": "d-jbr-wuluhan",
    "regencyId": "r-jbr-kab",
    "name": "Wuluhan",
    "lat": -8.35,
    "lng": 113.5167,
    "postalCode": "68162"
  },
  {
    "id": "d-jbr-balung",
    "regencyId": "r-jbr-kab",
    "name": "Balung",
    "lat": -8.2833,
    "lng": 113.5333,
    "postalCode": "68161"
  },
  {
    "id": "d-jbr-rambipuji",
    "regencyId": "r-jbr-kab",
    "name": "Rambipuji",
    "lat": -8.2,
    "lng": 113.6167,
    "postalCode": "68152"
  },
  {
    "id": "d-jbr-bangsalsari",
    "regencyId": "r-jbr-kab",
    "name": "Bangsalsari",
    "lat": -8.1833,
    "lng": 113.5167,
    "postalCode": "68154"
  },
  {
    "id": "d-jbr-tanggul",
    "regencyId": "r-jbr-kab",
    "name": "Tanggul",
    "lat": -8.1583,
    "lng": 113.45,
    "postalCode": "68155"
  },
  {
    "id": "d-jbr-sumberbaru",
    "regencyId": "r-jbr-kab",
    "name": "Sumberbaru",
    "lat": -8.1333,
    "lng": 113.3833,
    "postalCode": "68156"
  },
  {
    "id": "d-jbr-semboro",
    "regencyId": "r-jbr-kab",
    "name": "Semboro",
    "lat": -8.2167,
    "lng": 113.45,
    "postalCode": "68157"
  },
  {
    "id": "d-jbr-umbulsari",
    "regencyId": "r-jbr-kab",
    "name": "Umbulsari",
    "lat": -8.25,
    "lng": 113.45,
    "postalCode": "68166"
  },
  {
    "id": "d-jbr-kencong",
    "regencyId": "r-jbr-kab",
    "name": "Kencong",
    "lat": -8.2833,
    "lng": 113.3667,
    "postalCode": "68167"
  },
  {
    "id": "d-jbr-gumukmas",
    "regencyId": "r-jbr-kab",
    "name": "Gumukmas",
    "lat": -8.3167,
    "lng": 113.4167,
    "postalCode": "68165"
  },
  {
    "id": "d-jbr-puger",
    "regencyId": "r-jbr-kab",
    "name": "Puger (Pelabuhan Ikan)",
    "lat": -8.3667,
    "lng": 113.4833,
    "postalCode": "68164"
  },
  {
    "id": "d-jbr-jombang",
    "regencyId": "r-jbr-kab",
    "name": "Jombang",
    "lat": -8.2333,
    "lng": 113.35,
    "postalCode": "68168"
  },
  {
    "id": "d-jbr-pakusari",
    "regencyId": "r-jbr-kab",
    "name": "Pakusari",
    "lat": -8.1667,
    "lng": 113.7667,
    "postalCode": "68181"
  },
  {
    "id": "d-jbr-mayang",
    "regencyId": "r-jbr-kab",
    "name": "Mayang",
    "lat": -8.1833,
    "lng": 113.8,
    "postalCode": "68182"
  },
  {
    "id": "d-jbr-silo",
    "regencyId": "r-jbr-kab",
    "name": "Silo (Gumitir)",
    "lat": -8.2333,
    "lng": 113.9167,
    "postalCode": "68184"
  },
  {
    "id": "d-jbr-kalisat",
    "regencyId": "r-jbr-kab",
    "name": "Kalisat",
    "lat": -8.1167,
    "lng": 113.8167,
    "postalCode": "68193"
  },
  {
    "id": "d-jbr-ledokombo",
    "regencyId": "r-jbr-kab",
    "name": "Ledokombo",
    "lat": -8.1333,
    "lng": 113.8833,
    "postalCode": "68196"
  },
  {
    "id": "d-jbr-sumberjambe",
    "regencyId": "r-jbr-kab",
    "name": "Sumberjambe",
    "lat": -8.0833,
    "lng": 113.9167,
    "postalCode": "68195"
  },
  {
    "id": "d-jbr-sukowono",
    "regencyId": "r-jbr-kab",
    "name": "Sukowono",
    "lat": -8.0667,
    "lng": 113.8333,
    "postalCode": "68194"
  },
  {
    "id": "d-jbr-jelbuk",
    "regencyId": "r-jbr-kab",
    "name": "Jelbuk",
    "lat": -8.0833,
    "lng": 113.75,
    "postalCode": "68192"
  },
  {
    "id": "d-jbr-arjasa",
    "regencyId": "r-jbr-kab",
    "name": "Arjasa",
    "lat": -8.1167,
    "lng": 113.7333,
    "postalCode": "68191"
  },
  {
    "id": "d-jbg-jombang",
    "regencyId": "r-jbg-kab",
    "name": "Jombang (Pusat)",
    "lat": -7.5458,
    "lng": 112.2333,
    "postalCode": "61411"
  },
  {
    "id": "d-jbg-peterongan",
    "regencyId": "r-jbg-kab",
    "name": "Peterongan",
    "lat": -7.5389,
    "lng": 112.2833,
    "postalCode": "61481"
  },
  {
    "id": "d-jbg-jogoroto",
    "regencyId": "r-jbg-kab",
    "name": "Jogoroto",
    "lat": -7.5833,
    "lng": 112.2833,
    "postalCode": "61485"
  },
  {
    "id": "d-jbg-diwek",
    "regencyId": "r-jbg-kab",
    "name": "Diwek (Gus Dur/Tebuireng)",
    "lat": -7.6,
    "lng": 112.2333,
    "postalCode": "61471"
  },
  {
    "id": "d-jbg-gudo",
    "regencyId": "r-jbg-kab",
    "name": "Gudo",
    "lat": -7.6167,
    "lng": 112.1833,
    "postalCode": "61463"
  },
  {
    "id": "d-jbg-perak",
    "regencyId": "r-jbg-kab",
    "name": "Perak",
    "lat": -7.5833,
    "lng": 112.15,
    "postalCode": "61461"
  },
  {
    "id": "d-jbg-bandarkedungmulyo",
    "regencyId": "r-jbg-kab",
    "name": "Bandar Kedungmulyo",
    "lat": -7.5667,
    "lng": 112.1167,
    "postalCode": "61462"
  },
  {
    "id": "d-jbg-bareng",
    "regencyId": "r-jbg-kab",
    "name": "Bareng",
    "lat": -7.7,
    "lng": 112.3,
    "postalCode": "61474"
  },
  {
    "id": "d-jbg-wonosalam",
    "regencyId": "r-jbg-kab",
    "name": "Wonosalam (Gunung Anjasmoro)",
    "lat": -7.7167,
    "lng": 112.3833,
    "postalCode": "61476"
  },
  {
    "id": "d-jbg-mojowarno",
    "regencyId": "r-jbg-kab",
    "name": "Mojowarno",
    "lat": -7.65,
    "lng": 112.3,
    "postalCode": "61475"
  },
  {
    "id": "d-jbg-mojoagung",
    "regencyId": "r-jbg-kab",
    "name": "Mojoagung",
    "lat": -7.5667,
    "lng": 112.3444,
    "postalCode": "61482"
  },
  {
    "id": "d-jbg-sumobito",
    "regencyId": "r-jbg-kab",
    "name": "Sumobito",
    "lat": -7.5167,
    "lng": 112.3333,
    "postalCode": "61483"
  },
  {
    "id": "d-jbg-kesamben",
    "regencyId": "r-jbg-kab",
    "name": "Kesamben",
    "lat": -7.4833,
    "lng": 112.3167,
    "postalCode": "61484"
  },
  {
    "id": "d-jbg-tembelang",
    "regencyId": "r-jbg-kab",
    "name": "Tembelang",
    "lat": -7.4833,
    "lng": 112.2333,
    "postalCode": "61452"
  },
  {
    "id": "d-jbg-megaluh",
    "regencyId": "r-jbg-kab",
    "name": "Megaluh",
    "lat": -7.4833,
    "lng": 112.1833,
    "postalCode": "61457"
  },
  {
    "id": "d-jbg-ploso",
    "regencyId": "r-jbg-kab",
    "name": "Ploso",
    "lat": -7.4528,
    "lng": 112.2194,
    "postalCode": "61453"
  },
  {
    "id": "d-jbg-kabuh",
    "regencyId": "r-jbg-kab",
    "name": "Kabuh",
    "lat": -7.4,
    "lng": 112.2167,
    "postalCode": "61454"
  },
  {
    "id": "d-jbg-kudu",
    "regencyId": "r-jbg-kab",
    "name": "Kudu",
    "lat": -7.4333,
    "lng": 112.2833,
    "postalCode": "61455"
  },
  {
    "id": "d-jbg-ngusikan",
    "regencyId": "r-jbg-kab",
    "name": "Ngusikan",
    "lat": -7.4167,
    "lng": 112.3333,
    "postalCode": "61456"
  },
  {
    "id": "d-jbg-plandaan",
    "regencyId": "r-jbg-kab",
    "name": "Plandaan",
    "lat": -7.4333,
    "lng": 112.15,
    "postalCode": "61456"
  },
  {
    "id": "d-jbg-ngoro",
    "regencyId": "r-jbg-kab",
    "name": "Ngoro",
    "lat": -7.6833,
    "lng": 112.2667,
    "postalCode": "61473"
  },
  {
    "id": "d-kdrb-pare",
    "regencyId": "r-kdr-kab",
    "name": "Pare (Kampung Inggris)",
    "lat": -7.7667,
    "lng": 112.1833,
    "postalCode": "64211"
  },
  {
    "id": "d-kdrb-ngasem",
    "regencyId": "r-kdr-kab",
    "name": "Ngasem (SLG)",
    "lat": -7.8,
    "lng": 112.0667,
    "postalCode": "64182"
  },
  {
    "id": "d-kdrb-gampengrejo",
    "regencyId": "r-kdr-kab",
    "name": "Gampengrejo",
    "lat": -7.7778,
    "lng": 112.0278,
    "postalCode": "64182"
  },
  {
    "id": "d-kdrb-banyakan",
    "regencyId": "r-kdr-kab",
    "name": "Banyakan (Bandara Dhoho)",
    "lat": -7.7833,
    "lng": 111.9667,
    "postalCode": "64157"
  },
  {
    "id": "d-kdrb-tarokan",
    "regencyId": "r-kdr-kab",
    "name": "Tarokan",
    "lat": -7.75,
    "lng": 111.9333,
    "postalCode": "64152"
  },
  {
    "id": "d-kdrb-grogol",
    "regencyId": "r-kdr-kab",
    "name": "Grogol",
    "lat": -7.7333,
    "lng": 111.9833,
    "postalCode": "64151"
  },
  {
    "id": "d-kdrb-papar",
    "regencyId": "r-kdr-kab",
    "name": "Papar",
    "lat": -7.6833,
    "lng": 112.0833,
    "postalCode": "64153"
  },
  {
    "id": "d-kdrb-purwoasri",
    "regencyId": "r-kdr-kab",
    "name": "Purwoasri",
    "lat": -7.65,
    "lng": 112.1,
    "postalCode": "64154"
  },
  {
    "id": "d-kdrb-plemahan",
    "regencyId": "r-kdr-kab",
    "name": "Plemahan",
    "lat": -7.7167,
    "lng": 112.1333,
    "postalCode": "64155"
  },
  {
    "id": "d-kdrb-kunjang",
    "regencyId": "r-kdr-kab",
    "name": "Kunjang",
    "lat": -7.6833,
    "lng": 112.1667,
    "postalCode": "64156"
  },
  {
    "id": "d-kdrb-badas",
    "regencyId": "r-kdr-kab",
    "name": "Badas",
    "lat": -7.7333,
    "lng": 112.2167,
    "postalCode": "64221"
  },
  {
    "id": "d-kdrb-kepung",
    "regencyId": "r-kdr-kab",
    "name": "Kepung",
    "lat": -7.8,
    "lng": 112.25,
    "postalCode": "64293"
  },
  {
    "id": "d-kdrb-puncu",
    "regencyId": "r-kdr-kab",
    "name": "Puncu (Gunung Kelud)",
    "lat": -7.8833,
    "lng": 112.25,
    "postalCode": "64292"
  },
  {
    "id": "d-kdrb-plosoklaten",
    "regencyId": "r-kdr-kab",
    "name": "Plosoklaten",
    "lat": -7.8833,
    "lng": 112.1667,
    "postalCode": "64175"
  },
  {
    "id": "d-kdrb-gurah",
    "regencyId": "r-kdr-kab",
    "name": "Gurah",
    "lat": -7.8167,
    "lng": 112.1167,
    "postalCode": "64181"
  },
  {
    "id": "d-kdrb-pagu",
    "regencyId": "r-kdr-kab",
    "name": "Pagu",
    "lat": -7.7667,
    "lng": 112.0833,
    "postalCode": "64183"
  },
  {
    "id": "d-kdrb-kayenkidul",
    "regencyId": "r-kdr-kab",
    "name": "Kayen Kidul",
    "lat": -7.7333,
    "lng": 112.0833,
    "postalCode": "64183"
  },
  {
    "id": "d-kdrb-kandangan",
    "regencyId": "r-kdr-kab",
    "name": "Kandangan",
    "lat": -7.75,
    "lng": 112.2833,
    "postalCode": "64294"
  },
  {
    "id": "d-kdrb-wates",
    "regencyId": "r-kdr-kab",
    "name": "Wates",
    "lat": -7.9167,
    "lng": 112.1167,
    "postalCode": "64292"
  },
  {
    "id": "d-kdrb-ngancar",
    "regencyId": "r-kdr-kab",
    "name": "Ngancar",
    "lat": -7.9333,
    "lng": 112.2,
    "postalCode": "64291"
  },
  {
    "id": "d-kdrb-ringinrejo",
    "regencyId": "r-kdr-kab",
    "name": "Ringinrejo",
    "lat": -7.9833,
    "lng": 112.0333,
    "postalCode": "64176"
  },
  {
    "id": "d-kdrb-kandat",
    "regencyId": "r-kdr-kab",
    "name": "Kandat",
    "lat": -7.9333,
    "lng": 112.0167,
    "postalCode": "64173"
  },
  {
    "id": "d-kdrb-kras",
    "regencyId": "r-kdr-kab",
    "name": "Kras",
    "lat": -7.95,
    "lng": 111.9667,
    "postalCode": "64172"
  },
  {
    "id": "d-kdrb-ngadiluwih",
    "regencyId": "r-kdr-kab",
    "name": "Ngadiluwih",
    "lat": -7.9,
    "lng": 111.9833,
    "postalCode": "64171"
  },
  {
    "id": "d-kdrb-semen",
    "regencyId": "r-kdr-kab",
    "name": "Semen",
    "lat": -7.85,
    "lng": 111.9667,
    "postalCode": "64161"
  },
  {
    "id": "d-kdrb-mojo",
    "regencyId": "r-kdr-kab",
    "name": "Mojo",
    "lat": -7.9167,
    "lng": 111.9167,
    "postalCode": "64162"
  },
  {
    "id": "d-lmg-lamongan",
    "regencyId": "r-lmg-kab",
    "name": "Lamongan (Pusat)",
    "lat": -7.1194,
    "lng": 112.4139,
    "postalCode": "62211"
  },
  {
    "id": "d-lmg-tikung",
    "regencyId": "r-lmg-kab",
    "name": "Tikung",
    "lat": -7.1889,
    "lng": 112.4167,
    "postalCode": "62281"
  },
  {
    "id": "d-lmg-kembangbahu",
    "regencyId": "r-lmg-kab",
    "name": "Kembangbahu",
    "lat": -7.2167,
    "lng": 112.3667,
    "postalCode": "62282"
  },
  {
    "id": "d-lmg-sugio",
    "regencyId": "r-lmg-kab",
    "name": "Sugio",
    "lat": -7.2167,
    "lng": 112.2833,
    "postalCode": "62256"
  },
  {
    "id": "d-lmg-kedungpring",
    "regencyId": "r-lmg-kab",
    "name": "Kedungpring",
    "lat": -7.2,
    "lng": 112.2,
    "postalCode": "62272"
  },
  {
    "id": "d-lmg-modo",
    "regencyId": "r-lmg-kab",
    "name": "Modo",
    "lat": -7.25,
    "lng": 112.1667,
    "postalCode": "62275"
  },
  {
    "id": "d-lmg-bluluk",
    "regencyId": "r-lmg-kab",
    "name": "Bluluk",
    "lat": -7.3,
    "lng": 112.1667,
    "postalCode": "62274"
  },
  {
    "id": "d-lmg-ngimbang",
    "regencyId": "r-lmg-kab",
    "name": "Ngimbang",
    "lat": -7.3167,
    "lng": 112.2333,
    "postalCode": "62273"
  },
  {
    "id": "d-lmg-sambeng",
    "regencyId": "r-lmg-kab",
    "name": "Sambeng",
    "lat": -7.2833,
    "lng": 112.3,
    "postalCode": "62284"
  },
  {
    "id": "d-lmg-mantup",
    "regencyId": "r-lmg-kab",
    "name": "Mantup",
    "lat": -7.25,
    "lng": 112.35,
    "postalCode": "62283"
  },
  {
    "id": "d-lmg-sukorame",
    "regencyId": "r-lmg-kab",
    "name": "Sukorame",
    "lat": -7.3333,
    "lng": 112.1333,
    "postalCode": "62276"
  },
  {
    "id": "d-lmg-babat",
    "regencyId": "r-lmg-kab",
    "name": "Babat (Pasar Babat)",
    "lat": -7.1083,
    "lng": 112.1639,
    "postalCode": "62291"
  },
  {
    "id": "d-lmg-pucuk",
    "regencyId": "r-lmg-kab",
    "name": "Pucuk",
    "lat": -7.1167,
    "lng": 112.25,
    "postalCode": "62292"
  },
  {
    "id": "d-lmg-sukodadi",
    "regencyId": "r-lmg-kab",
    "name": "Sukodadi",
    "lat": -7.1167,
    "lng": 112.3167,
    "postalCode": "62253"
  },
  {
    "id": "d-lmg-deket",
    "regencyId": "r-lmg-kab",
    "name": "Deket",
    "lat": -7.1333,
    "lng": 112.45,
    "postalCode": "62291"
  },
  {
    "id": "d-lmg-glagah",
    "regencyId": "r-lmg-kab",
    "name": "Glagah",
    "lat": -7.0833,
    "lng": 112.4833,
    "postalCode": "62292"
  },
  {
    "id": "d-lmg-karangbinangun",
    "regencyId": "r-lmg-kab",
    "name": "Karangbinangun",
    "lat": -7.0333,
    "lng": 112.4833,
    "postalCode": "62293"
  },
  {
    "id": "d-lmg-kalitengah",
    "regencyId": "r-lmg-kab",
    "name": "Kalitengah",
    "lat": -7.05,
    "lng": 112.4167,
    "postalCode": "62255"
  },
  {
    "id": "d-lmg-turi",
    "regencyId": "r-lmg-kab",
    "name": "Turi",
    "lat": -7.0833,
    "lng": 112.3833,
    "postalCode": "62252"
  },
  {
    "id": "d-lmg-sekaran",
    "regencyId": "r-lmg-kab",
    "name": "Sekaran",
    "lat": -7.0667,
    "lng": 112.3167,
    "postalCode": "62261"
  },
  {
    "id": "d-lmg-maduran",
    "regencyId": "r-lmg-kab",
    "name": "Maduran",
    "lat": -7.05,
    "lng": 112.3333,
    "postalCode": "62261"
  },
  {
    "id": "d-lmg-karanggeneng",
    "regencyId": "r-lmg-kab",
    "name": "Karanggeneng",
    "lat": -7.0167,
    "lng": 112.3667,
    "postalCode": "62254"
  },
  {
    "id": "d-lmg-laren",
    "regencyId": "r-lmg-kab",
    "name": "Laren",
    "lat": -6.9833,
    "lng": 112.3,
    "postalCode": "62262"
  },
  {
    "id": "d-lmg-solokuro",
    "regencyId": "r-lmg-kab",
    "name": "Solokuro",
    "lat": -6.95,
    "lng": 112.3667,
    "postalCode": "62265"
  },
  {
    "id": "d-lmg-paciran",
    "regencyId": "r-lmg-kab",
    "name": "Paciran (WBL/Sunan Drajat)",
    "lat": -6.8833,
    "lng": 112.3333,
    "postalCode": "62264"
  },
  {
    "id": "d-lmg-brondong",
    "regencyId": "r-lmg-kab",
    "name": "Brondong (Pelabuhan Nelayan)",
    "lat": -6.8833,
    "lng": 112.2833,
    "postalCode": "62263"
  },
  {
    "id": "d-lmg-sarirejo",
    "regencyId": "r-lmg-kab",
    "name": "Sarirejo",
    "lat": -7.1833,
    "lng": 112.4667,
    "postalCode": "62285"
  },
  {
    "id": "d-lmj-lumajang",
    "regencyId": "r-lmj-kab",
    "name": "Lumajang (Pusat)",
    "lat": -8.1333,
    "lng": 113.225,
    "postalCode": "67311"
  },
  {
    "id": "d-lmj-sukodono",
    "regencyId": "r-lmj-kab",
    "name": "Sukodono",
    "lat": -8.1167,
    "lng": 113.2333,
    "postalCode": "67352"
  },
  {
    "id": "d-lmj-kedungjajang",
    "regencyId": "r-lmj-kab",
    "name": "Kedungjajang",
    "lat": -8.0667,
    "lng": 113.25,
    "postalCode": "67358"
  },
  {
    "id": "d-lmj-klakah",
    "regencyId": "r-lmj-kab",
    "name": "Klakah",
    "lat": -8,
    "lng": 113.25,
    "postalCode": "67356"
  },
  {
    "id": "d-lmj-ranuyoso",
    "regencyId": "r-lmj-kab",
    "name": "Ranuyoso (Danau Ranu)",
    "lat": -7.95,
    "lng": 113.25,
    "postalCode": "67357"
  },
  {
    "id": "d-lmj-randuagung",
    "regencyId": "r-lmj-kab",
    "name": "Randuagung",
    "lat": -8.0667,
    "lng": 113.3167,
    "postalCode": "67354"
  },
  {
    "id": "d-lmj-jatiroto",
    "regencyId": "r-lmj-kab",
    "name": "Jatiroto",
    "lat": -8.1167,
    "lng": 113.3833,
    "postalCode": "67355"
  },
  {
    "id": "d-lmj-rowokangkung",
    "regencyId": "r-lmj-kab",
    "name": "Rowokangkung",
    "lat": -8.1667,
    "lng": 113.3333,
    "postalCode": "67359"
  },
  {
    "id": "d-lmj-yosowilangun",
    "regencyId": "r-lmj-kab",
    "name": "Yosowilangun",
    "lat": -8.2333,
    "lng": 113.3,
    "postalCode": "67382"
  },
  {
    "id": "d-lmj-tekung",
    "regencyId": "r-lmj-kab",
    "name": "Tekung",
    "lat": -8.1833,
    "lng": 113.25,
    "postalCode": "67365"
  },
  {
    "id": "d-lmj-kunir",
    "regencyId": "r-lmj-kab",
    "name": "Kunir",
    "lat": -8.2333,
    "lng": 113.2333,
    "postalCode": "67383"
  },
  {
    "id": "d-lmj-tempeh",
    "regencyId": "r-lmj-kab",
    "name": "Tempeh",
    "lat": -8.2,
    "lng": 113.1833,
    "postalCode": "67371"
  },
  {
    "id": "d-lmj-pasirian",
    "regencyId": "r-lmj-kab",
    "name": "Pasirian",
    "lat": -8.2333,
    "lng": 113.1167,
    "postalCode": "67372"
  },
  {
    "id": "d-lmj-candipuro",
    "regencyId": "r-lmj-kab",
    "name": "Candipuro",
    "lat": -8.1833,
    "lng": 113.05,
    "postalCode": "67373"
  },
  {
    "id": "d-lmj-pronojiwo",
    "regencyId": "r-lmj-kab",
    "name": "Pronojiwo (Tumpak Sewu)",
    "lat": -8.2,
    "lng": 112.9167,
    "postalCode": "67374"
  },
  {
    "id": "d-lmj-tempursari",
    "regencyId": "r-lmj-kab",
    "name": "Tempursari",
    "lat": -8.3,
    "lng": 112.95,
    "postalCode": "67375"
  },
  {
    "id": "d-lmj-pasrujambe",
    "regencyId": "r-lmj-kab",
    "name": "Pasrujambe",
    "lat": -8.15,
    "lng": 113.0667,
    "postalCode": "67362"
  },
  {
    "id": "d-lmj-senduro",
    "regencyId": "r-lmj-kab",
    "name": "Senduro (Gunung Semeru)",
    "lat": -8.1167,
    "lng": 113.0833,
    "postalCode": "67361"
  },
  {
    "id": "d-lmj-gucialit",
    "regencyId": "r-lmj-kab",
    "name": "Gucialit (Kebun Teh)",
    "lat": -8.05,
    "lng": 113.15,
    "postalCode": "67353"
  },
  {
    "id": "d-lmj-padang",
    "regencyId": "r-lmj-kab",
    "name": "Padang",
    "lat": -8.0833,
    "lng": 113.1833,
    "postalCode": "67352"
  },
  {
    "id": "d-lmj-sumbersuko",
    "regencyId": "r-lmj-kab",
    "name": "Sumbersuko",
    "lat": -8.1667,
    "lng": 113.2,
    "postalCode": "67365"
  },
  {
    "id": "d-mdnb-mejayan",
    "regencyId": "r-mdn-kab",
    "name": "Mejayan (Caruban Pemkab)",
    "lat": -7.55,
    "lng": 111.6667,
    "postalCode": "63153"
  },
  {
    "id": "d-mdnb-pilangkenceng",
    "regencyId": "r-mdn-kab",
    "name": "Pilangkenceng",
    "lat": -7.5,
    "lng": 111.6333,
    "postalCode": "63154"
  },
  {
    "id": "d-mdnb-saradan",
    "regencyId": "r-mdn-kab",
    "name": "Saradan",
    "lat": -7.5389,
    "lng": 111.7389,
    "postalCode": "63155"
  },
  {
    "id": "d-mdnb-balerejo",
    "regencyId": "r-mdn-kab",
    "name": "Balerejo",
    "lat": -7.5333,
    "lng": 111.5833,
    "postalCode": "63152"
  },
  {
    "id": "d-mdnb-madiun",
    "regencyId": "r-mdn-kab",
    "name": "Madiun",
    "lat": -7.5833,
    "lng": 111.55,
    "postalCode": "63151"
  },
  {
    "id": "d-mdnb-sawahan",
    "regencyId": "r-mdn-kab",
    "name": "Sawahan",
    "lat": -7.5667,
    "lng": 111.5,
    "postalCode": "63162"
  },
  {
    "id": "d-mdnb-jiwan",
    "regencyId": "r-mdn-kab",
    "name": "Jiwan",
    "lat": -7.6083,
    "lng": 111.4917,
    "postalCode": "63161"
  },
  {
    "id": "d-mdnb-wonoasri",
    "regencyId": "r-mdn-kab",
    "name": "Wonoasri",
    "lat": -7.55,
    "lng": 111.6167,
    "postalCode": "63157"
  },
  {
    "id": "d-mdnb-wungu",
    "regencyId": "r-mdn-kab",
    "name": "Wungu",
    "lat": -7.6833,
    "lng": 111.5833,
    "postalCode": "63181"
  },
  {
    "id": "d-mdnb-kare",
    "regencyId": "r-mdn-kab",
    "name": "Kare (Wilis)",
    "lat": -7.75,
    "lng": 111.6833,
    "postalCode": "63182"
  },
  {
    "id": "d-mdnb-gemarang",
    "regencyId": "r-mdn-kab",
    "name": "Gemarang",
    "lat": -7.6333,
    "lng": 111.75,
    "postalCode": "63156"
  },
  {
    "id": "d-mdnb-dagangan",
    "regencyId": "r-mdn-kab",
    "name": "Dagangan",
    "lat": -7.7167,
    "lng": 111.5667,
    "postalCode": "63172"
  },
  {
    "id": "d-mdnb-geger",
    "regencyId": "r-mdn-kab",
    "name": "Geger",
    "lat": -7.7,
    "lng": 111.5167,
    "postalCode": "63171"
  },
  {
    "id": "d-mdnb-kebonsari",
    "regencyId": "r-mdn-kab",
    "name": "Kebonsari",
    "lat": -7.7,
    "lng": 111.4833,
    "postalCode": "63173"
  },
  {
    "id": "d-mdnb-dolopo",
    "regencyId": "r-mdn-kab",
    "name": "Dolopo",
    "lat": -7.7333,
    "lng": 111.5333,
    "postalCode": "63174"
  },
  {
    "id": "d-mgt-magetan",
    "regencyId": "r-mgt-kab",
    "name": "Magetan (Pusat)",
    "lat": -7.6533,
    "lng": 111.3283,
    "postalCode": "63311"
  },
  {
    "id": "d-mgt-panekan",
    "regencyId": "r-mgt-kab",
    "name": "Panekan",
    "lat": -7.6,
    "lng": 111.3,
    "postalCode": "63352"
  },
  {
    "id": "d-mgt-sukomoro",
    "regencyId": "r-mgt-kab",
    "name": "Sukomoro",
    "lat": -7.6,
    "lng": 111.3833,
    "postalCode": "63391"
  },
  {
    "id": "d-mgt-bendo",
    "regencyId": "r-mgt-kab",
    "name": "Bendo",
    "lat": -7.6,
    "lng": 111.4,
    "postalCode": "63384"
  },
  {
    "id": "d-mgt-maospati",
    "regencyId": "r-mgt-kab",
    "name": "Maospati (Iswahjudi)",
    "lat": -7.5833,
    "lng": 111.4333,
    "postalCode": "63392"
  },
  {
    "id": "d-mgt-karangrejo",
    "regencyId": "r-mgt-kab",
    "name": "Karangrejo",
    "lat": -7.55,
    "lng": 111.4333,
    "postalCode": "63395"
  },
  {
    "id": "d-mgt-barat",
    "regencyId": "r-mgt-kab",
    "name": "Barat (Stasiun Magetan)",
    "lat": -7.5333,
    "lng": 111.4333,
    "postalCode": "63393"
  },
  {
    "id": "d-mgt-kartoharjo",
    "regencyId": "r-mgt-kab",
    "name": "Kartoharjo",
    "lat": -7.5167,
    "lng": 111.4833,
    "postalCode": "63394"
  },
  {
    "id": "d-mgt-karas",
    "regencyId": "r-mgt-kab",
    "name": "Karas",
    "lat": -7.55,
    "lng": 111.35,
    "postalCode": "63396"
  },
  {
    "id": "d-mgt-ngariboyo",
    "regencyId": "r-mgt-kab",
    "name": "Ngariboyo",
    "lat": -7.6833,
    "lng": 111.35,
    "postalCode": "63363"
  },
  {
    "id": "d-mgt-parang",
    "regencyId": "r-mgt-kab",
    "name": "Parang",
    "lat": -7.7333,
    "lng": 111.3167,
    "postalCode": "63371"
  },
  {
    "id": "d-mgt-lembeyan",
    "regencyId": "r-mgt-kab",
    "name": "Lembeyan",
    "lat": -7.75,
    "lng": 111.3833,
    "postalCode": "63372"
  },
  {
    "id": "d-mgt-kawedanan",
    "regencyId": "r-mgt-kab",
    "name": "Kawedanan",
    "lat": -7.6833,
    "lng": 111.4167,
    "postalCode": "63382"
  },
  {
    "id": "d-mgt-takeran",
    "regencyId": "r-mgt-kab",
    "name": "Takeran",
    "lat": -7.6667,
    "lng": 111.4667,
    "postalCode": "63381"
  },
  {
    "id": "d-mgt-nguntoronadi",
    "regencyId": "r-mgt-kab",
    "name": "Nguntoronadi",
    "lat": -7.6833,
    "lng": 111.4333,
    "postalCode": "63383"
  },
  {
    "id": "d-mgt-plaosan",
    "regencyId": "r-mgt-kab",
    "name": "Plaosan (Telaga Sarangan)",
    "lat": -7.675,
    "lng": 111.2333,
    "postalCode": "63361"
  },
  {
    "id": "d-mgt-sidorejo",
    "regencyId": "r-mgt-kab",
    "name": "Sidorejo",
    "lat": -7.6333,
    "lng": 111.2667,
    "postalCode": "63362"
  },
  {
    "id": "d-mgt-poncol",
    "regencyId": "r-mgt-kab",
    "name": "Poncol",
    "lat": -7.7333,
    "lng": 111.2667,
    "postalCode": "63364"
  },
  {
    "id": "d-mlgb-kepanjen",
    "regencyId": "r-mlg-kab",
    "name": "Kepanjen (Pusat Pemkab)",
    "lat": -8.1333,
    "lng": 112.5667,
    "postalCode": "65163"
  },
  {
    "id": "d-mlgb-singosari",
    "regencyId": "r-mlg-kab",
    "name": "Singosari (KEK Singhasari)",
    "lat": -7.8944,
    "lng": 112.6667,
    "postalCode": "65153"
  },
  {
    "id": "d-mlgb-lawang",
    "regencyId": "r-mlg-kab",
    "name": "Lawang",
    "lat": -7.8389,
    "lng": 112.6972,
    "postalCode": "65211"
  },
  {
    "id": "d-mlgb-dau",
    "regencyId": "r-mlg-kab",
    "name": "Dau",
    "lat": -7.9333,
    "lng": 112.5833,
    "postalCode": "65151"
  },
  {
    "id": "d-mlgb-turen",
    "regencyId": "r-mlg-kab",
    "name": "Turen",
    "lat": -8.1722,
    "lng": 112.7056,
    "postalCode": "65175"
  },
  {
    "id": "d-mlgb-pakis",
    "regencyId": "r-mlg-kab",
    "name": "Pakis (Bandara Abd Saleh)",
    "lat": -7.95,
    "lng": 112.7167,
    "postalCode": "65154"
  },
  {
    "id": "d-mlgb-karangploso",
    "regencyId": "r-mlg-kab",
    "name": "Karangploso",
    "lat": -7.89,
    "lng": 112.6,
    "postalCode": "65152"
  },
  {
    "id": "d-mlgb-pujon",
    "regencyId": "r-mlg-kab",
    "name": "Pujon (Wisata Susu)",
    "lat": -7.85,
    "lng": 112.4667,
    "postalCode": "65391"
  },
  {
    "id": "d-mlgb-ngantang",
    "regencyId": "r-mlg-kab",
    "name": "Ngantang (Bendungan Selorejo)",
    "lat": -7.8333,
    "lng": 112.3667,
    "postalCode": "65392"
  },
  {
    "id": "d-mlgb-kasembon",
    "regencyId": "r-mlg-kab",
    "name": "Kasembon",
    "lat": -7.7833,
    "lng": 112.3333,
    "postalCode": "65393"
  },
  {
    "id": "d-mlgb-jabung",
    "regencyId": "r-mlg-kab",
    "name": "Jabung",
    "lat": -7.9333,
    "lng": 112.7667,
    "postalCode": "65155"
  },
  {
    "id": "d-mlgb-tumpang",
    "regencyId": "r-mlg-kab",
    "name": "Tumpang (Akses Bromo)",
    "lat": -8,
    "lng": 112.7667,
    "postalCode": "65156"
  },
  {
    "id": "d-mlgb-poncokusumo",
    "regencyId": "r-mlg-kab",
    "name": "Poncokusumo",
    "lat": -8.05,
    "lng": 112.8,
    "postalCode": "65157"
  },
  {
    "id": "d-mlgb-wringinanom",
    "regencyId": "r-mlg-kab",
    "name": "Wajak",
    "lat": -8.1,
    "lng": 112.7333,
    "postalCode": "65173"
  },
  {
    "id": "d-mlgb-tajinan",
    "regencyId": "r-mlg-kab",
    "name": "Tajinan",
    "lat": -8.0667,
    "lng": 112.6667,
    "postalCode": "65172"
  },
  {
    "id": "d-mlgb-bululawang",
    "regencyId": "r-mlg-kab",
    "name": "Bululawang",
    "lat": -8.0833,
    "lng": 112.6333,
    "postalCode": "65171"
  },
  {
    "id": "d-mlgb-gondanglegi",
    "regencyId": "r-mlg-kab",
    "name": "Gondanglegi",
    "lat": -8.1833,
    "lng": 112.6333,
    "postalCode": "65174"
  },
  {
    "id": "d-mlgb-pagelaran",
    "regencyId": "r-mlg-kab",
    "name": "Pagelaran",
    "lat": -8.2,
    "lng": 112.6,
    "postalCode": "65174"
  },
  {
    "id": "d-mlgb-bantur",
    "regencyId": "r-mlg-kab",
    "name": "Bantur (Pantai Balekambang)",
    "lat": -8.3,
    "lng": 112.5667,
    "postalCode": "65179"
  },
  {
    "id": "d-mlgb-gedangan",
    "regencyId": "r-mlg-kab",
    "name": "Gedangan",
    "lat": -8.3167,
    "lng": 112.6333,
    "postalCode": "65178"
  },
  {
    "id": "d-mlgb-sumbermanjing",
    "regencyId": "r-mlg-kab",
    "name": "Sumbermanjing Wetan (Sendang Biru)",
    "lat": -8.35,
    "lng": 112.7167,
    "postalCode": "65176"
  },
  {
    "id": "d-mlgb-dampit",
    "regencyId": "r-mlg-kab",
    "name": "Dampit (Kopi Dampit)",
    "lat": -8.2167,
    "lng": 112.75,
    "postalCode": "65181"
  },
  {
    "id": "d-mlgb-tirtoyudo",
    "regencyId": "r-mlg-kab",
    "name": "Tirtoyudo",
    "lat": -8.2333,
    "lng": 112.8333,
    "postalCode": "65182"
  },
  {
    "id": "d-mlgb-ampelgading",
    "regencyId": "r-mlg-kab",
    "name": "Ampelgading",
    "lat": -8.25,
    "lng": 112.9,
    "postalCode": "65183"
  },
  {
    "id": "d-mlgb-pakisaji",
    "regencyId": "r-mlg-kab",
    "name": "Pakisaji",
    "lat": -8.0667,
    "lng": 112.5833,
    "postalCode": "65162"
  },
  {
    "id": "d-mlgb-wagir",
    "regencyId": "r-mlg-kab",
    "name": "Wagir",
    "lat": -8.0167,
    "lng": 112.5667,
    "postalCode": "65158"
  },
  {
    "id": "d-mlgb-ngajum",
    "regencyId": "r-mlg-kab",
    "name": "Ngajum",
    "lat": -8.1167,
    "lng": 112.5167,
    "postalCode": "65164"
  },
  {
    "id": "d-mlgb-wonosari",
    "regencyId": "r-mlg-kab",
    "name": "Wonosari (Gunung Kawi)",
    "lat": -8.05,
    "lng": 112.4833,
    "postalCode": "65161"
  },
  {
    "id": "d-mlgb-kromengan",
    "regencyId": "r-mlg-kab",
    "name": "Kromengan",
    "lat": -8.15,
    "lng": 112.4833,
    "postalCode": "65165"
  },
  {
    "id": "d-mlgb-sumberpucung",
    "regencyId": "r-mlg-kab",
    "name": "Sumberpucung",
    "lat": -8.1667,
    "lng": 112.4833,
    "postalCode": "65165"
  },
  {
    "id": "d-mlgb-kalipare",
    "regencyId": "r-mlg-kab",
    "name": "Kalipare",
    "lat": -8.2,
    "lng": 112.45,
    "postalCode": "65166"
  },
  {
    "id": "d-mlgb-donomulyo",
    "regencyId": "r-mlg-kab",
    "name": "Donomulyo (Modangan)",
    "lat": -8.2833,
    "lng": 112.4167,
    "postalCode": "65167"
  },
  {
    "id": "d-mlgb-pagak",
    "regencyId": "r-mlg-kab",
    "name": "Pagak",
    "lat": -8.2333,
    "lng": 112.5167,
    "postalCode": "65168"
  },
  {
    "id": "d-mjkb-mojosari",
    "regencyId": "r-mjk-kab",
    "name": "Mojosari (Pusat)",
    "lat": -7.5056,
    "lng": 112.5556,
    "postalCode": "61382"
  },
  {
    "id": "d-mjkb-trowulan",
    "regencyId": "r-mjk-kab",
    "name": "Trowulan (Situs Majapahit)",
    "lat": -7.5583,
    "lng": 112.3833,
    "postalCode": "61362"
  },
  {
    "id": "d-mjkb-pacet",
    "regencyId": "r-mjk-kab",
    "name": "Pacet (Wisata Air Panas)",
    "lat": -7.6694,
    "lng": 112.5417,
    "postalCode": "61374"
  },
  {
    "id": "d-mjkb-trawas",
    "regencyId": "r-mjk-kab",
    "name": "Trawas (Pegunungan Welirang)",
    "lat": -7.6667,
    "lng": 112.5833,
    "postalCode": "61375"
  },
  {
    "id": "d-mjkb-ngoro",
    "regencyId": "r-mjk-kab",
    "name": "Ngoro (Ngoro Industri)",
    "lat": -7.5806,
    "lng": 112.6167,
    "postalCode": "61385"
  },
  {
    "id": "d-mjkb-pungging",
    "regencyId": "r-mjk-kab",
    "name": "Pungging",
    "lat": -7.5333,
    "lng": 112.5833,
    "postalCode": "61384"
  },
  {
    "id": "d-mjkb-kutorejo",
    "regencyId": "r-mjk-kab",
    "name": "Kutorejo",
    "lat": -7.5667,
    "lng": 112.5167,
    "postalCode": "61383"
  },
  {
    "id": "d-mjkb-dlanggu",
    "regencyId": "r-mjk-kab",
    "name": "Dlanggu",
    "lat": -7.5667,
    "lng": 112.4667,
    "postalCode": "61371"
  },
  {
    "id": "d-mjkb-gondang",
    "regencyId": "r-mjk-kab",
    "name": "Gondang",
    "lat": -7.6333,
    "lng": 112.4833,
    "postalCode": "61372"
  },
  {
    "id": "d-mjkb-jatirejo",
    "regencyId": "r-mjk-kab",
    "name": "Jatirejo",
    "lat": -7.6,
    "lng": 112.4167,
    "postalCode": "61373"
  },
  {
    "id": "d-mjkb-puri",
    "regencyId": "r-mjk-kab",
    "name": "Puri",
    "lat": -7.5167,
    "lng": 112.45,
    "postalCode": "61363"
  },
  {
    "id": "d-mjkb-sooko",
    "regencyId": "r-mjk-kab",
    "name": "Sooko",
    "lat": -7.4833,
    "lng": 112.4167,
    "postalCode": "61361"
  },
  {
    "id": "d-mjkb-bangsal",
    "regencyId": "r-mjk-kab",
    "name": "Bangsal",
    "lat": -7.4833,
    "lng": 112.4833,
    "postalCode": "61381"
  },
  {
    "id": "d-mjkb-mojoanyar",
    "regencyId": "r-mjk-kab",
    "name": "Mojoanyar",
    "lat": -7.4667,
    "lng": 112.4667,
    "postalCode": "61364"
  },
  {
    "id": "d-mjkb-gedeg",
    "regencyId": "r-mjk-kab",
    "name": "Gedeg",
    "lat": -7.4333,
    "lng": 112.4167,
    "postalCode": "61351"
  },
  {
    "id": "d-mjkb-kemlagi",
    "regencyId": "r-mjk-kab",
    "name": "Kemlagi",
    "lat": -7.3833,
    "lng": 112.4167,
    "postalCode": "61353"
  },
  {
    "id": "d-mjkb-jetis",
    "regencyId": "r-mjk-kab",
    "name": "Jetis",
    "lat": -7.4167,
    "lng": 112.4667,
    "postalCode": "61352"
  },
  {
    "id": "d-mjkb-dawarblandong",
    "regencyId": "r-mjk-kab",
    "name": "Dawarblandong",
    "lat": -7.3333,
    "lng": 112.4333,
    "postalCode": "61354"
  },
  {
    "id": "d-ngj-nganjuk",
    "regencyId": "r-ngj-kab",
    "name": "Nganjuk (Kota)",
    "lat": -7.6042,
    "lng": 111.9028,
    "postalCode": "64411"
  },
  {
    "id": "d-ngj-bagor",
    "regencyId": "r-ngj-kab",
    "name": "Bagor",
    "lat": -7.5667,
    "lng": 111.85,
    "postalCode": "64461"
  },
  {
    "id": "d-ngj-wilangan",
    "regencyId": "r-ngj-kab",
    "name": "Wilangan",
    "lat": -7.55,
    "lng": 111.8,
    "postalCode": "64462"
  },
  {
    "id": "d-ngj-sukomoro",
    "regencyId": "r-ngj-kab",
    "name": "Sukomoro",
    "lat": -7.5833,
    "lng": 111.95,
    "postalCode": "64481"
  },
  {
    "id": "d-ngj-tanjunganom",
    "regencyId": "r-ngj-kab",
    "name": "Tanjunganom (Warujayeng)",
    "lat": -7.6333,
    "lng": 112.0167,
    "postalCode": "64483"
  },
  {
    "id": "d-ngj-kertosono",
    "regencyId": "r-ngj-kab",
    "name": "Kertosono",
    "lat": -7.5833,
    "lng": 112.0833,
    "postalCode": "64311"
  },
  {
    "id": "d-ngj-baron",
    "regencyId": "r-ngj-kab",
    "name": "Baron",
    "lat": -7.6,
    "lng": 112.05,
    "postalCode": "64485"
  },
  {
    "id": "d-ngj-patianrowo",
    "regencyId": "r-ngj-kab",
    "name": "Patianrowo",
    "lat": -7.5333,
    "lng": 112.0833,
    "postalCode": "64491"
  },
  {
    "id": "d-ngj-jatikalen",
    "regencyId": "r-ngj-kab",
    "name": "Jatikalen",
    "lat": -7.4833,
    "lng": 112.1167,
    "postalCode": "64492"
  },
  {
    "id": "d-ngj-lengkong",
    "regencyId": "r-ngj-kab",
    "name": "Lengkong",
    "lat": -7.5,
    "lng": 112.05,
    "postalCode": "64493"
  },
  {
    "id": "d-ngj-gondang",
    "regencyId": "r-ngj-kab",
    "name": "Gondang",
    "lat": -7.5167,
    "lng": 111.9833,
    "postalCode": "64494"
  },
  {
    "id": "d-ngj-ngluyu",
    "regencyId": "r-ngj-kab",
    "name": "Ngluyu",
    "lat": -7.4667,
    "lng": 111.95,
    "postalCode": "64452"
  },
  {
    "id": "d-ngj-rejoso",
    "regencyId": "r-ngj-kab",
    "name": "Rejoso",
    "lat": -7.5,
    "lng": 111.9,
    "postalCode": "64453"
  },
  {
    "id": "d-ngj-loceret",
    "regencyId": "r-ngj-kab",
    "name": "Loceret",
    "lat": -7.6667,
    "lng": 111.9,
    "postalCode": "64471"
  },
  {
    "id": "d-ngj-berbek",
    "regencyId": "r-ngj-kab",
    "name": "Berbek",
    "lat": -7.65,
    "lng": 111.8667,
    "postalCode": "64473"
  },
  {
    "id": "d-ngj-sawahan",
    "regencyId": "r-ngj-kab",
    "name": "Sawahan (Sedudo)",
    "lat": -7.7333,
    "lng": 111.7833,
    "postalCode": "64475"
  },
  {
    "id": "d-ngj-ngetos",
    "regencyId": "r-ngj-kab",
    "name": "Ngetos",
    "lat": -7.7,
    "lng": 111.8333,
    "postalCode": "64474"
  },
  {
    "id": "d-ngj-pace",
    "regencyId": "r-ngj-kab",
    "name": "Pace",
    "lat": -7.6667,
    "lng": 111.9667,
    "postalCode": "64472"
  },
  {
    "id": "d-ngj-prambon",
    "regencyId": "r-ngj-kab",
    "name": "Prambon",
    "lat": -7.7,
    "lng": 112.0333,
    "postalCode": "64484"
  },
  {
    "id": "d-ngj-ngronggot",
    "regencyId": "r-ngj-kab",
    "name": "Ngronggot",
    "lat": -7.6667,
    "lng": 112.0833,
    "postalCode": "64482"
  },
  {
    "id": "d-ngw-ngawi",
    "regencyId": "r-ngw-kab",
    "name": "Ngawi (Benteng Pendem)",
    "lat": -7.4042,
    "lng": 111.4458,
    "postalCode": "63211"
  },
  {
    "id": "d-ngw-paron",
    "regencyId": "r-ngw-kab",
    "name": "Paron",
    "lat": -7.4583,
    "lng": 111.3917,
    "postalCode": "63253"
  },
  {
    "id": "d-ngw-kedunggalar",
    "regencyId": "r-ngw-kab",
    "name": "Kedunggalar (Trinil)",
    "lat": -7.4167,
    "lng": 111.3167,
    "postalCode": "63254"
  },
  {
    "id": "d-ngw-pitu",
    "regencyId": "r-ngw-kab",
    "name": "Pitu",
    "lat": -7.3667,
    "lng": 111.35,
    "postalCode": "63252"
  },
  {
    "id": "d-ngw-widodaren",
    "regencyId": "r-ngw-kab",
    "name": "Widodaren (Walikukun)",
    "lat": -7.3833,
    "lng": 111.2333,
    "postalCode": "63256"
  },
  {
    "id": "d-ngw-mantingan",
    "regencyId": "r-ngw-kab",
    "name": "Mantingan (Gontor Putri)",
    "lat": -7.3667,
    "lng": 111.1667,
    "postalCode": "63261"
  },
  {
    "id": "d-ngw-karanganyar",
    "regencyId": "r-ngw-kab",
    "name": "Karanganyar",
    "lat": -7.4333,
    "lng": 111.1833,
    "postalCode": "63257"
  },
  {
    "id": "d-ngw-sine",
    "regencyId": "r-ngw-kab",
    "name": "Sine",
    "lat": -7.5,
    "lng": 111.1833,
    "postalCode": "63264"
  },
  {
    "id": "d-ngw-ngrambe",
    "regencyId": "r-ngw-kab",
    "name": "Ngrambe",
    "lat": -7.5167,
    "lng": 111.2167,
    "postalCode": "63263"
  },
  {
    "id": "d-ngw-jogorogo",
    "regencyId": "r-ngw-kab",
    "name": "Jogorogo",
    "lat": -7.5333,
    "lng": 111.2667,
    "postalCode": "63262"
  },
  {
    "id": "d-ngw-kendal",
    "regencyId": "r-ngw-kab",
    "name": "Kendal",
    "lat": -7.5333,
    "lng": 111.3333,
    "postalCode": "63265"
  },
  {
    "id": "d-ngw-gerih",
    "regencyId": "r-ngw-kab",
    "name": "Gerih",
    "lat": -7.5,
    "lng": 111.3833,
    "postalCode": "63272"
  },
  {
    "id": "d-ngw-geneng",
    "regencyId": "r-ngw-kab",
    "name": "Geneng",
    "lat": -7.4833,
    "lng": 111.4333,
    "postalCode": "63271"
  },
  {
    "id": "d-ngw-kwadungan",
    "regencyId": "r-ngw-kab",
    "name": "Kwadungan",
    "lat": -7.5167,
    "lng": 111.4833,
    "postalCode": "63283"
  },
  {
    "id": "d-ngw-pangkur",
    "regencyId": "r-ngw-kab",
    "name": "Pangkur",
    "lat": -7.4667,
    "lng": 111.5167,
    "postalCode": "63282"
  },
  {
    "id": "d-ngw-karangjati",
    "regencyId": "r-ngw-kab",
    "name": "Karangjati",
    "lat": -7.45,
    "lng": 111.5833,
    "postalCode": "63284"
  },
  {
    "id": "d-ngw-bringin",
    "regencyId": "r-ngw-kab",
    "name": "Bringin",
    "lat": -7.35,
    "lng": 111.55,
    "postalCode": "63285"
  },
  {
    "id": "d-ngw-kasreman",
    "regencyId": "r-ngw-kab",
    "name": "Kasreman",
    "lat": -7.3833,
    "lng": 111.5167,
    "postalCode": "63281"
  },
  {
    "id": "d-ngw-padas",
    "regencyId": "r-ngw-kab",
    "name": "Padas",
    "lat": -7.4,
    "lng": 111.5167,
    "postalCode": "63281"
  },
  {
    "id": "d-pct-pacitan",
    "regencyId": "r-pct-kab",
    "name": "Pacitan (Kota 1001 Goa)",
    "lat": -8.2044,
    "lng": 111.0933,
    "postalCode": "63511"
  },
  {
    "id": "d-pct-kebonagung",
    "regencyId": "r-pct-kab",
    "name": "Kebonagung",
    "lat": -8.2333,
    "lng": 111.1667,
    "postalCode": "63561"
  },
  {
    "id": "d-pct-ngadirojo",
    "regencyId": "r-pct-kab",
    "name": "Ngadirojo (Lorok)",
    "lat": -8.2417,
    "lng": 111.3167,
    "postalCode": "63572"
  },
  {
    "id": "d-pct-tulakan",
    "regencyId": "r-pct-kab",
    "name": "Tulakan",
    "lat": -8.1833,
    "lng": 111.2833,
    "postalCode": "63571"
  },
  {
    "id": "d-pct-sudimoro",
    "regencyId": "r-pct-kab",
    "name": "Sudimoro (PLTU Pacitan)",
    "lat": -8.2167,
    "lng": 111.3833,
    "postalCode": "63573"
  },
  {
    "id": "d-pct-tegalombo",
    "regencyId": "r-pct-kab",
    "name": "Tegalombo",
    "lat": -8.0833,
    "lng": 111.2333,
    "postalCode": "63582"
  },
  {
    "id": "d-pct-bandar",
    "regencyId": "r-pct-kab",
    "name": "Bandar",
    "lat": -8.0333,
    "lng": 111.2667,
    "postalCode": "63583"
  },
  {
    "id": "d-pct-nawangan",
    "regencyId": "r-pct-kab",
    "name": "Nawangan (Monumen Sudirman)",
    "lat": -8.0333,
    "lng": 111.1833,
    "postalCode": "63584"
  },
  {
    "id": "d-pct-arjosari",
    "regencyId": "r-pct-kab",
    "name": "Arjosari",
    "lat": -8.1167,
    "lng": 111.15,
    "postalCode": "63581"
  },
  {
    "id": "d-pct-pringkuku",
    "regencyId": "r-pct-kab",
    "name": "Pringkuku",
    "lat": -8.1833,
    "lng": 111.0333,
    "postalCode": "63552"
  },
  {
    "id": "d-pct-punung",
    "regencyId": "r-pct-kab",
    "name": "Punung (Goa Gong)",
    "lat": -8.15,
    "lng": 111.0167,
    "postalCode": "63553"
  },
  {
    "id": "d-pct-donorojo",
    "regencyId": "r-pct-kab",
    "name": "Donorojo (Klayar)",
    "lat": -8.1833,
    "lng": 110.9667,
    "postalCode": "63554"
  },
  {
    "id": "d-pmk-pamekasan",
    "regencyId": "r-pmk-kab",
    "name": "Pamekasan (Pusat)",
    "lat": -7.16,
    "lng": 113.4833,
    "postalCode": "69311"
  },
  {
    "id": "d-pmk-tlanakan",
    "regencyId": "r-pmk-kab",
    "name": "Tlanakan",
    "lat": -7.2167,
    "lng": 113.45,
    "postalCode": "69371"
  },
  {
    "id": "d-pmk-pademawu",
    "regencyId": "r-pmk-kab",
    "name": "Pademawu",
    "lat": -7.1833,
    "lng": 113.5167,
    "postalCode": "69381"
  },
  {
    "id": "d-pmk-galis",
    "regencyId": "r-pmk-kab",
    "name": "Galis",
    "lat": -7.2,
    "lng": 113.5667,
    "postalCode": "69382"
  },
  {
    "id": "d-pmk-larangan",
    "regencyId": "r-pmk-kab",
    "name": "Larangan",
    "lat": -7.1333,
    "lng": 113.5667,
    "postalCode": "69383"
  },
  {
    "id": "d-pmk-kadur",
    "regencyId": "r-pmk-kab",
    "name": "Kadur",
    "lat": -7.0833,
    "lng": 113.55,
    "postalCode": "69384"
  },
  {
    "id": "d-pmk-pakong",
    "regencyId": "r-pmk-kab",
    "name": "Pakong",
    "lat": -7.05,
    "lng": 113.55,
    "postalCode": "69352"
  },
  {
    "id": "d-pmk-waru",
    "regencyId": "r-pmk-kab",
    "name": "Waru",
    "lat": -6.9833,
    "lng": 113.5333,
    "postalCode": "69353"
  },
  {
    "id": "d-pmk-batumarmar",
    "regencyId": "r-pmk-kab",
    "name": "Batu Marmar",
    "lat": -6.9,
    "lng": 113.5,
    "postalCode": "69354"
  },
  {
    "id": "d-pmk-pasean",
    "regencyId": "r-pmk-kab",
    "name": "Pasean",
    "lat": -6.8833,
    "lng": 113.5667,
    "postalCode": "69356"
  },
  {
    "id": "d-pmk-pegantenan",
    "regencyId": "r-pmk-kab",
    "name": "Pegantenan",
    "lat": -7.0833,
    "lng": 113.4667,
    "postalCode": "69361"
  },
  {
    "id": "d-pmk-palengaan",
    "regencyId": "r-pmk-kab",
    "name": "Palengaan",
    "lat": -7.1167,
    "lng": 113.4167,
    "postalCode": "69362"
  },
  {
    "id": "d-pmk-proppo",
    "regencyId": "r-pmk-kab",
    "name": "Proppo",
    "lat": -7.15,
    "lng": 113.4167,
    "postalCode": "69363"
  },
  {
    "id": "d-psrb-bangil",
    "regencyId": "r-psr-kab",
    "name": "Bangil (Ibukota Pemkab)",
    "lat": -7.5972,
    "lng": 112.7889,
    "postalCode": "67153"
  },
  {
    "id": "d-psrb-beji",
    "regencyId": "r-psr-kab",
    "name": "Beji",
    "lat": -7.5833,
    "lng": 112.75,
    "postalCode": "67154"
  },
  {
    "id": "d-psrb-gempol",
    "regencyId": "r-psr-kab",
    "name": "Gempol",
    "lat": -7.5833,
    "lng": 112.7,
    "postalCode": "67155"
  },
  {
    "id": "d-psrb-pandaan",
    "regencyId": "r-psr-kab",
    "name": "Pandaan",
    "lat": -7.65,
    "lng": 112.6917,
    "postalCode": "67156"
  },
  {
    "id": "d-psrb-prigen",
    "regencyId": "r-psr-kab",
    "name": "Prigen (Tretes)",
    "lat": -7.6833,
    "lng": 112.6278,
    "postalCode": "67157"
  },
  {
    "id": "d-psrb-sukorejo",
    "regencyId": "r-psr-kab",
    "name": "Sukorejo",
    "lat": -7.7083,
    "lng": 112.7083,
    "postalCode": "67161"
  },
  {
    "id": "d-psrb-purwosari",
    "regencyId": "r-psr-kab",
    "name": "Purwosari",
    "lat": -7.75,
    "lng": 112.75,
    "postalCode": "67162"
  },
  {
    "id": "d-psrb-purwodadi",
    "regencyId": "r-psr-kab",
    "name": "Purwodadi (Kebun Raya)",
    "lat": -7.7833,
    "lng": 112.7333,
    "postalCode": "67163"
  },
  {
    "id": "d-psrb-tutur",
    "regencyId": "r-psr-kab",
    "name": "Tutur (Nongkojajar)",
    "lat": -7.8333,
    "lng": 112.8,
    "postalCode": "67165"
  },
  {
    "id": "d-psrb-puspo",
    "regencyId": "r-psr-kab",
    "name": "Puspo",
    "lat": -7.8333,
    "lng": 112.8667,
    "postalCode": "67166"
  },
  {
    "id": "d-psrb-tosari",
    "regencyId": "r-psr-kab",
    "name": "Tosari (Bromo)",
    "lat": -7.8833,
    "lng": 112.9,
    "postalCode": "67177"
  },
  {
    "id": "d-psrb-pasrepan",
    "regencyId": "r-psr-kab",
    "name": "Pasrepan",
    "lat": -7.7667,
    "lng": 112.8833,
    "postalCode": "67175"
  },
  {
    "id": "d-psrb-lumbang",
    "regencyId": "r-psr-kab",
    "name": "Lumbang",
    "lat": -7.8167,
    "lng": 112.9833,
    "postalCode": "67183"
  },
  {
    "id": "d-psrb-kejayan",
    "regencyId": "r-psr-kab",
    "name": "Kejayan",
    "lat": -7.7,
    "lng": 112.8667,
    "postalCode": "67172"
  },
  {
    "id": "d-psrb-wonorejo",
    "regencyId": "r-psr-kab",
    "name": "Wonorejo",
    "lat": -7.7167,
    "lng": 112.8,
    "postalCode": "67173"
  },
  {
    "id": "d-psrb-rembang",
    "regencyId": "r-psr-kab",
    "name": "Rembang (PIER Industri)",
    "lat": -7.65,
    "lng": 112.8167,
    "postalCode": "67152"
  },
  {
    "id": "d-psrb-kraton",
    "regencyId": "r-psr-kab",
    "name": "Kraton",
    "lat": -7.6333,
    "lng": 112.8667,
    "postalCode": "67151"
  },
  {
    "id": "d-psrb-pohjentrek",
    "regencyId": "r-psr-kab",
    "name": "Pohjentrek",
    "lat": -7.6667,
    "lng": 112.8833,
    "postalCode": "67171"
  },
  {
    "id": "d-psrb-gondangwetan",
    "regencyId": "r-psr-kab",
    "name": "Gondangwetan",
    "lat": -7.6833,
    "lng": 112.9333,
    "postalCode": "67174"
  },
  {
    "id": "d-psrb-winongan",
    "regencyId": "r-psr-kab",
    "name": "Winongan",
    "lat": -7.7333,
    "lng": 112.95,
    "postalCode": "67182"
  },
  {
    "id": "d-psrb-grati",
    "regencyId": "r-psr-kab",
    "name": "Grati (Danau Ranu Grati)",
    "lat": -7.7167,
    "lng": 113.0167,
    "postalCode": "67184"
  },
  {
    "id": "d-psrb-rejoso",
    "regencyId": "r-psr-kab",
    "name": "Rejoso",
    "lat": -7.6667,
    "lng": 112.9833,
    "postalCode": "67181"
  },
  {
    "id": "d-psrb-lekok",
    "regencyId": "r-psr-kab",
    "name": "Lekok",
    "lat": -7.6333,
    "lng": 113.0167,
    "postalCode": "67186"
  },
  {
    "id": "d-psrb-nguling",
    "regencyId": "r-psr-kab",
    "name": "Nguling",
    "lat": -7.7,
    "lng": 113.0667,
    "postalCode": "67185"
  },
  {
    "id": "d-png-ponorogo",
    "regencyId": "r-png-kab",
    "name": "Ponorogo (Kota)",
    "lat": -7.8686,
    "lng": 111.4628,
    "postalCode": "63411"
  },
  {
    "id": "d-png-babadan",
    "regencyId": "r-png-kab",
    "name": "Babadan",
    "lat": -7.8167,
    "lng": 111.4667,
    "postalCode": "63491"
  },
  {
    "id": "d-png-jenangan",
    "regencyId": "r-png-kab",
    "name": "Jenangan",
    "lat": -7.8333,
    "lng": 111.5333,
    "postalCode": "63492"
  },
  {
    "id": "d-png-ngebel",
    "regencyId": "r-png-kab",
    "name": "Ngebel (Telaga Ngebel)",
    "lat": -7.7833,
    "lng": 111.6,
    "postalCode": "63493"
  },
  {
    "id": "d-png-pudak",
    "regencyId": "r-png-kab",
    "name": "Pudak",
    "lat": -7.8167,
    "lng": 111.6667,
    "postalCode": "63494"
  },
  {
    "id": "d-png-pulung",
    "regencyId": "r-png-kab",
    "name": "Pulung",
    "lat": -7.8833,
    "lng": 111.6,
    "postalCode": "63481"
  },
  {
    "id": "d-png-sooko",
    "regencyId": "r-png-kab",
    "name": "Sooko",
    "lat": -7.95,
    "lng": 111.6333,
    "postalCode": "63482"
  },
  {
    "id": "d-png-sawoo",
    "regencyId": "r-png-kab",
    "name": "Sawoo",
    "lat": -7.9667,
    "lng": 111.5667,
    "postalCode": "63475"
  },
  {
    "id": "d-png-sambit",
    "regencyId": "r-png-kab",
    "name": "Sambit",
    "lat": -7.9333,
    "lng": 111.5167,
    "postalCode": "63474"
  },
  {
    "id": "d-png-mlarak",
    "regencyId": "r-png-kab",
    "name": "Mlarak",
    "lat": -7.9,
    "lng": 111.5167,
    "postalCode": "63472"
  },
  {
    "id": "d-png-siman",
    "regencyId": "r-png-kab",
    "name": "Siman (UNIDA Gontor)",
    "lat": -7.8889,
    "lng": 111.4944,
    "postalCode": "63471"
  },
  {
    "id": "d-png-jetis",
    "regencyId": "r-png-kab",
    "name": "Jetis",
    "lat": -7.9333,
    "lng": 111.4667,
    "postalCode": "63473"
  },
  {
    "id": "d-png-bungkal",
    "regencyId": "r-png-kab",
    "name": "Bungkal",
    "lat": -7.9833,
    "lng": 111.45,
    "postalCode": "63462"
  },
  {
    "id": "d-png-ngrayun",
    "regencyId": "r-png-kab",
    "name": "Ngrayun",
    "lat": -8.0667,
    "lng": 111.4167,
    "postalCode": "63464"
  },
  {
    "id": "d-png-slahung",
    "regencyId": "r-png-kab",
    "name": "Slahung",
    "lat": -8,
    "lng": 111.3833,
    "postalCode": "63463"
  },
  {
    "id": "d-png-balong",
    "regencyId": "r-png-kab",
    "name": "Balong",
    "lat": -7.95,
    "lng": 111.4,
    "postalCode": "63461"
  },
  {
    "id": "d-png-jambon",
    "regencyId": "r-png-kab",
    "name": "Jambon",
    "lat": -7.9,
    "lng": 111.3667,
    "postalCode": "63456"
  },
  {
    "id": "d-png-badegan",
    "regencyId": "r-png-kab",
    "name": "Badegan",
    "lat": -7.8667,
    "lng": 111.3167,
    "postalCode": "63455"
  },
  {
    "id": "d-png-sampung",
    "regencyId": "r-png-kab",
    "name": "Sampung (Goa Lowo)",
    "lat": -7.8167,
    "lng": 111.35,
    "postalCode": "63454"
  },
  {
    "id": "d-png-sukorejo",
    "regencyId": "r-png-kab",
    "name": "Sukorejo",
    "lat": -7.8333,
    "lng": 111.4167,
    "postalCode": "63453"
  },
  {
    "id": "d-png-kauman",
    "regencyId": "r-png-kab",
    "name": "Kauman (Somoroto)",
    "lat": -7.8722,
    "lng": 111.4111,
    "postalCode": "63451"
  },
  {
    "id": "d-prbb-kraksaan",
    "regencyId": "r-prb-kab",
    "name": "Kraksaan (Pusat Pemkab)",
    "lat": -7.7583,
    "lng": 113.4167,
    "postalCode": "67282"
  },
  {
    "id": "d-prbb-paiton",
    "regencyId": "r-prb-kab",
    "name": "Paiton (PLTU)",
    "lat": -7.7167,
    "lng": 113.5167,
    "postalCode": "67291"
  },
  {
    "id": "d-prbb-pakuniran",
    "regencyId": "r-prb-kab",
    "name": "Pakuniran",
    "lat": -7.7833,
    "lng": 113.5167,
    "postalCode": "67292"
  },
  {
    "id": "d-prbb-kotaanyar",
    "regencyId": "r-prb-kab",
    "name": "Kotaanyar",
    "lat": -7.7667,
    "lng": 113.4833,
    "postalCode": "67293"
  },
  {
    "id": "d-prbb-besuk",
    "regencyId": "r-prb-kab",
    "name": "Besuk",
    "lat": -7.7833,
    "lng": 113.45,
    "postalCode": "67283"
  },
  {
    "id": "d-prbb-krejengan",
    "regencyId": "r-prb-kab",
    "name": "Krejengan",
    "lat": -7.7833,
    "lng": 113.4,
    "postalCode": "67284"
  },
  {
    "id": "d-prbb-gading",
    "regencyId": "r-prb-kab",
    "name": "Gading",
    "lat": -7.85,
    "lng": 113.4333,
    "postalCode": "67294"
  },
  {
    "id": "d-prbb-tiris",
    "regencyId": "r-prb-kab",
    "name": "Tiris (Ranu Segaran)",
    "lat": -7.95,
    "lng": 113.45,
    "postalCode": "67287"
  },
  {
    "id": "d-prbb-krucil",
    "regencyId": "r-prb-kab",
    "name": "Krucil (Bermiting)",
    "lat": -7.9333,
    "lng": 113.5333,
    "postalCode": "67288"
  },
  {
    "id": "d-prbb-maron",
    "regencyId": "r-prb-kab",
    "name": "Maron",
    "lat": -7.8333,
    "lng": 113.3667,
    "postalCode": "67276"
  },
  {
    "id": "d-prbb-banyuanyar",
    "regencyId": "r-prb-kab",
    "name": "Banyuanyar",
    "lat": -7.85,
    "lng": 113.3,
    "postalCode": "67275"
  },
  {
    "id": "d-prbb-tegalsiwalan",
    "regencyId": "r-prb-kab",
    "name": "Tegalsiwalan",
    "lat": -7.8667,
    "lng": 113.25,
    "postalCode": "67274"
  },
  {
    "id": "d-prbb-leces",
    "regencyId": "r-prb-kab",
    "name": "Leces",
    "lat": -7.8167,
    "lng": 113.2333,
    "postalCode": "67273"
  },
  {
    "id": "d-prbb-bantaran",
    "regencyId": "r-prb-kab",
    "name": "Bantaran",
    "lat": -7.85,
    "lng": 113.1833,
    "postalCode": "67261"
  },
  {
    "id": "d-prbb-kuripan",
    "regencyId": "r-prb-kab",
    "name": "Kuripan",
    "lat": -7.8833,
    "lng": 113.1333,
    "postalCode": "67262"
  },
  {
    "id": "d-prbb-wonomerto",
    "regencyId": "r-prb-kab",
    "name": "Wonomerto",
    "lat": -7.8,
    "lng": 113.15,
    "postalCode": "67271"
  },
  {
    "id": "d-prbb-sukapura",
    "regencyId": "r-prb-kab",
    "name": "Sukapura (Bromo)",
    "lat": -7.9167,
    "lng": 113,
    "postalCode": "67254"
  },
  {
    "id": "d-prbb-sumber",
    "regencyId": "r-prb-kab",
    "name": "Sumber",
    "lat": -7.9333,
    "lng": 113.0833,
    "postalCode": "67263"
  },
  {
    "id": "d-prbb-lumbang",
    "regencyId": "r-prb-kab",
    "name": "Lumbang (Madakaripura)",
    "lat": -7.85,
    "lng": 113.0667,
    "postalCode": "67255"
  },
  {
    "id": "d-prbb-tongas",
    "regencyId": "r-prb-kab",
    "name": "Tongas",
    "lat": -7.75,
    "lng": 113.1,
    "postalCode": "67252"
  },
  {
    "id": "d-prbb-sumberasih",
    "regencyId": "r-prb-kab",
    "name": "Sumberasih",
    "lat": -7.7667,
    "lng": 113.1667,
    "postalCode": "67251"
  },
  {
    "id": "d-prbb-dringu",
    "regencyId": "r-prb-kab",
    "name": "Dringu",
    "lat": -7.7667,
    "lng": 113.2667,
    "postalCode": "67271"
  },
  {
    "id": "d-prbb-gending",
    "regencyId": "r-prb-kab",
    "name": "Gending",
    "lat": -7.7833,
    "lng": 113.3167,
    "postalCode": "67272"
  },
  {
    "id": "d-prbb-pajarakan",
    "regencyId": "r-prb-kab",
    "name": "Pajarakan",
    "lat": -7.7667,
    "lng": 113.3667,
    "postalCode": "67281"
  },
  {
    "id": "d-spg-sampang",
    "regencyId": "r-spg-kab",
    "name": "Sampang (Pusat)",
    "lat": -7.1889,
    "lng": 113.2472,
    "postalCode": "69211"
  },
  {
    "id": "d-spg-torjun",
    "regencyId": "r-spg-kab",
    "name": "Torjun",
    "lat": -7.1667,
    "lng": 113.2,
    "postalCode": "69271"
  },
  {
    "id": "d-spg-jrengik",
    "regencyId": "r-spg-kab",
    "name": "Jrengik",
    "lat": -7.15,
    "lng": 113.15,
    "postalCode": "69267"
  },
  {
    "id": "d-spg-sreseh",
    "regencyId": "r-spg-kab",
    "name": "Sreseh",
    "lat": -7.2167,
    "lng": 113.1167,
    "postalCode": "69273"
  },
  {
    "id": "d-spg-tambelangan",
    "regencyId": "r-spg-kab",
    "name": "Tambelangan",
    "lat": -7.1,
    "lng": 113.1667,
    "postalCode": "69253"
  },
  {
    "id": "d-spg-kedungdung",
    "regencyId": "r-spg-kab",
    "name": "Kedungdung",
    "lat": -7.1,
    "lng": 113.2333,
    "postalCode": "69252"
  },
  {
    "id": "d-spg-robatal",
    "regencyId": "r-spg-kab",
    "name": "Robatal",
    "lat": -7.0667,
    "lng": 113.2833,
    "postalCode": "69255"
  },
  {
    "id": "d-spg-karangpenang",
    "regencyId": "r-spg-kab",
    "name": "Karang Penang",
    "lat": -7.05,
    "lng": 113.3333,
    "postalCode": "69254"
  },
  {
    "id": "d-spg-omben",
    "regencyId": "r-spg-kab",
    "name": "Omben",
    "lat": -7.1167,
    "lng": 113.3,
    "postalCode": "69261"
  },
  {
    "id": "d-spg-camplong",
    "regencyId": "r-spg-kab",
    "name": "Camplong",
    "lat": -7.2167,
    "lng": 113.3333,
    "postalCode": "69281"
  },
  {
    "id": "d-spg-pangarengan",
    "regencyId": "r-spg-kab",
    "name": "Pangarengan",
    "lat": -7.2167,
    "lng": 113.2,
    "postalCode": "69272"
  },
  {
    "id": "d-spg-ketapang",
    "regencyId": "r-spg-kab",
    "name": "Ketapang (Pantura)",
    "lat": -6.9167,
    "lng": 113.2833,
    "postalCode": "69261"
  },
  {
    "id": "d-spg-sokobanah",
    "regencyId": "r-spg-kab",
    "name": "Sokobanah",
    "lat": -6.9333,
    "lng": 113.3667,
    "postalCode": "69262"
  },
  {
    "id": "d-spg-banyuates",
    "regencyId": "r-spg-kab",
    "name": "Banyuates (Nipah)",
    "lat": -6.9333,
    "lng": 113.1833,
    "postalCode": "69263"
  },
  {
    "id": "d-stb-situbondo",
    "regencyId": "r-stb-kab",
    "name": "Situbondo (Pusat)",
    "lat": -7.7067,
    "lng": 114.0044,
    "postalCode": "68311"
  },
  {
    "id": "d-stb-panji",
    "regencyId": "r-stb-kab",
    "name": "Panji",
    "lat": -7.7111,
    "lng": 114.0333,
    "postalCode": "68321"
  },
  {
    "id": "d-stb-mangaran",
    "regencyId": "r-stb-kab",
    "name": "Mangaran",
    "lat": -7.6667,
    "lng": 114.0333,
    "postalCode": "68363"
  },
  {
    "id": "d-stb-kapongan",
    "regencyId": "r-stb-kab",
    "name": "Kapongan",
    "lat": -7.7167,
    "lng": 114.0833,
    "postalCode": "68362"
  },
  {
    "id": "d-stb-arjasa",
    "regencyId": "r-stb-kab",
    "name": "Arjasa",
    "lat": -7.7333,
    "lng": 114.1333,
    "postalCode": "68371"
  },
  {
    "id": "d-stb-jangkar",
    "regencyId": "r-stb-kab",
    "name": "Jangkar (Pelabuhan)",
    "lat": -7.7167,
    "lng": 114.2,
    "postalCode": "68372"
  },
  {
    "id": "d-stb-asembagus",
    "regencyId": "r-stb-kab",
    "name": "Asembagus",
    "lat": -7.75,
    "lng": 114.2333,
    "postalCode": "68373"
  },
  {
    "id": "d-stb-banyuputih",
    "regencyId": "r-stb-kab",
    "name": "Banyuputih (Baluran)",
    "lat": -7.8,
    "lng": 114.3667,
    "postalCode": "68374"
  },
  {
    "id": "d-stb-panarukan",
    "regencyId": "r-stb-kab",
    "name": "Panarukan (Titik Nol)",
    "lat": -7.7,
    "lng": 113.9667,
    "postalCode": "68351"
  },
  {
    "id": "d-stb-kendit",
    "regencyId": "r-stb-kab",
    "name": "Kendit",
    "lat": -7.7333,
    "lng": 113.9167,
    "postalCode": "68352"
  },
  {
    "id": "d-stb-bungatan",
    "regencyId": "r-stb-kab",
    "name": "Bungatan (Pasir Putih)",
    "lat": -7.7167,
    "lng": 113.8333,
    "postalCode": "68358"
  },
  {
    "id": "d-stb-mlandingan",
    "regencyId": "r-stb-kab",
    "name": "Mlandingan",
    "lat": -7.7333,
    "lng": 113.7833,
    "postalCode": "68353"
  },
  {
    "id": "d-stb-suboh",
    "regencyId": "r-stb-kab",
    "name": "Suboh",
    "lat": -7.75,
    "lng": 113.7333,
    "postalCode": "68354"
  },
  {
    "id": "d-stb-besuki",
    "regencyId": "r-stb-kab",
    "name": "Besuki",
    "lat": -7.7333,
    "lng": 113.6833,
    "postalCode": "68372"
  },
  {
    "id": "d-stb-banyuglugur",
    "regencyId": "r-stb-kab",
    "name": "Banyuglugur (Utama Raya)",
    "lat": -7.7167,
    "lng": 113.6167,
    "postalCode": "68359"
  },
  {
    "id": "d-stb-jatibanteng",
    "regencyId": "r-stb-kab",
    "name": "Jatibanteng",
    "lat": -7.8,
    "lng": 113.6667,
    "postalCode": "68357"
  },
  {
    "id": "d-stb-sumbermalang",
    "regencyId": "r-stb-kab",
    "name": "Sumbermalang (Rengganis)",
    "lat": -7.8333,
    "lng": 113.6167,
    "postalCode": "68355"
  },
  {
    "id": "d-smp-kotasumenep",
    "regencyId": "r-smp-kab",
    "name": "Kota Sumenep (Keraton)",
    "lat": -7.0167,
    "lng": 113.8667,
    "postalCode": "69411"
  },
  {
    "id": "d-smp-kalianget",
    "regencyId": "r-smp-kab",
    "name": "Kalianget (Pelabuhan)",
    "lat": -7.05,
    "lng": 113.9333,
    "postalCode": "69471"
  },
  {
    "id": "d-smp-talango",
    "regencyId": "r-smp-kab",
    "name": "Talango (Pulau Poteran)",
    "lat": -7.0667,
    "lng": 113.95,
    "postalCode": "69481"
  },
  {
    "id": "d-smp-batuan",
    "regencyId": "r-smp-kab",
    "name": "Batuan",
    "lat": -7.0333,
    "lng": 113.8333,
    "postalCode": "69451"
  },
  {
    "id": "d-smp-saronggi",
    "regencyId": "r-smp-kab",
    "name": "Saronggi",
    "lat": -7.1,
    "lng": 113.85,
    "postalCode": "69467"
  },
  {
    "id": "d-smp-bluto",
    "regencyId": "r-smp-kab",
    "name": "Bluto",
    "lat": -7.1333,
    "lng": 113.8167,
    "postalCode": "69466"
  },
  {
    "id": "d-smp-pragaan",
    "regencyId": "r-smp-kab",
    "name": "Pragaan",
    "lat": -7.1333,
    "lng": 113.7333,
    "postalCode": "69465"
  },
  {
    "id": "d-smp-lenteng",
    "regencyId": "r-smp-kab",
    "name": "Lenteng",
    "lat": -7.0667,
    "lng": 113.7833,
    "postalCode": "69461"
  },
  {
    "id": "d-smp-ganding",
    "regencyId": "r-smp-kab",
    "name": "Ganding",
    "lat": -7.0667,
    "lng": 113.7,
    "postalCode": "69462"
  },
  {
    "id": "d-smp-gulukguluk",
    "regencyId": "r-smp-kab",
    "name": "Guluk-Guluk",
    "lat": -7.05,
    "lng": 113.6333,
    "postalCode": "69463"
  },
  {
    "id": "d-smp-pasongsongan",
    "regencyId": "r-smp-kab",
    "name": "Pasongsongan",
    "lat": -6.9167,
    "lng": 113.65,
    "postalCode": "69457"
  },
  {
    "id": "d-smp-ambunten",
    "regencyId": "r-smp-kab",
    "name": "Ambunten",
    "lat": -6.9,
    "lng": 113.7333,
    "postalCode": "69455"
  },
  {
    "id": "d-smp-rubaru",
    "regencyId": "r-smp-kab",
    "name": "Rubaru",
    "lat": -6.9667,
    "lng": 113.7833,
    "postalCode": "69456"
  },
  {
    "id": "d-smp-dasuk",
    "regencyId": "r-smp-kab",
    "name": "Dasuk",
    "lat": -6.9167,
    "lng": 113.8333,
    "postalCode": "69454"
  },
  {
    "id": "d-smp-manding",
    "regencyId": "r-smp-kab",
    "name": "Manding",
    "lat": -6.95,
    "lng": 113.85,
    "postalCode": "69452"
  },
  {
    "id": "d-smp-batuputih",
    "regencyId": "r-smp-kab",
    "name": "Batuputih",
    "lat": -6.9,
    "lng": 113.9167,
    "postalCode": "69453"
  },
  {
    "id": "d-smp-gapura",
    "regencyId": "r-smp-kab",
    "name": "Gapura",
    "lat": -6.9833,
    "lng": 113.9333,
    "postalCode": "69472"
  },
  {
    "id": "d-smp-dungkek",
    "regencyId": "r-smp-kab",
    "name": "Dungkek",
    "lat": -6.9667,
    "lng": 114.0333,
    "postalCode": "69474"
  },
  {
    "id": "d-smp-batangbatang",
    "regencyId": "r-smp-kab",
    "name": "Batang-Batang (Lombang)",
    "lat": -6.9333,
    "lng": 113.9833,
    "postalCode": "69473"
  },
  {
    "id": "d-smp-giligenting",
    "regencyId": "r-smp-kab",
    "name": "Gili Genting",
    "lat": -7.1833,
    "lng": 113.9167,
    "postalCode": "69482"
  },
  {
    "id": "d-smp-nonggunong",
    "regencyId": "r-smp-kab",
    "name": "Nonggunong (Sepudi)",
    "lat": -7.1167,
    "lng": 114.1833,
    "postalCode": "69484"
  },
  {
    "id": "d-smp-gayam",
    "regencyId": "r-smp-kab",
    "name": "Gayam (Sepudi)",
    "lat": -7.15,
    "lng": 114.2667,
    "postalCode": "69483"
  },
  {
    "id": "d-smp-raas",
    "regencyId": "r-smp-kab",
    "name": "Raas",
    "lat": -7.15,
    "lng": 114.55,
    "postalCode": "69485"
  },
  {
    "id": "d-smp-arjasamdr",
    "regencyId": "r-smp-kab",
    "name": "Arjasa (Kangean)",
    "lat": -6.8667,
    "lng": 115.3,
    "postalCode": "69491"
  },
  {
    "id": "d-smp-kangayan",
    "regencyId": "r-smp-kab",
    "name": "Kangayan (Kangean)",
    "lat": -6.8833,
    "lng": 115.5333,
    "postalCode": "69491"
  },
  {
    "id": "d-smp-sapeken",
    "regencyId": "r-smp-kab",
    "name": "Sapeken",
    "lat": -7.0333,
    "lng": 115.7,
    "postalCode": "69493"
  },
  {
    "id": "d-smp-masalembu",
    "regencyId": "r-smp-kab",
    "name": "Masalembu",
    "lat": -5.55,
    "lng": 114.4333,
    "postalCode": "69492"
  },
  {
    "id": "d-trg-trenggalek",
    "regencyId": "r-trg-kab",
    "name": "Trenggalek (Pusat)",
    "lat": -8.05,
    "lng": 111.7167,
    "postalCode": "66311"
  },
  {
    "id": "d-trg-pogalan",
    "regencyId": "r-trg-kab",
    "name": "Pogalan",
    "lat": -8.0667,
    "lng": 111.7667,
    "postalCode": "66371"
  },
  {
    "id": "d-trg-durenan",
    "regencyId": "r-trg-kab",
    "name": "Durenan",
    "lat": -8.0833,
    "lng": 111.8,
    "postalCode": "66381"
  },
  {
    "id": "d-trg-gandusari",
    "regencyId": "r-trg-kab",
    "name": "Gandusari",
    "lat": -8.1167,
    "lng": 111.7333,
    "postalCode": "66372"
  },
  {
    "id": "d-trg-kampak",
    "regencyId": "r-trg-kab",
    "name": "Kampak",
    "lat": -8.1667,
    "lng": 111.6833,
    "postalCode": "66373"
  },
  {
    "id": "d-trg-watulimo",
    "regencyId": "r-trg-kab",
    "name": "Watulimo (Prigi)",
    "lat": -8.2833,
    "lng": 111.7167,
    "postalCode": "66382"
  },
  {
    "id": "d-trg-karangan",
    "regencyId": "r-trg-kab",
    "name": "Karangan",
    "lat": -8.0667,
    "lng": 111.6667,
    "postalCode": "66361"
  },
  {
    "id": "d-trg-suruh",
    "regencyId": "r-trg-kab",
    "name": "Suruh",
    "lat": -8.0833,
    "lng": 111.6167,
    "postalCode": "66362"
  },
  {
    "id": "d-trg-pule",
    "regencyId": "r-trg-kab",
    "name": "Pule",
    "lat": -8.15,
    "lng": 111.55,
    "postalCode": "66363"
  },
  {
    "id": "d-trg-dongko",
    "regencyId": "r-trg-kab",
    "name": "Dongko",
    "lat": -8.2167,
    "lng": 111.55,
    "postalCode": "66363"
  },
  {
    "id": "d-trg-panggul",
    "regencyId": "r-trg-kab",
    "name": "Panggul (Pelang)",
    "lat": -8.2333,
    "lng": 111.45,
    "postalCode": "66364"
  },
  {
    "id": "d-trg-munjungan",
    "regencyId": "r-trg-kab",
    "name": "Munjungan",
    "lat": -8.2667,
    "lng": 111.6,
    "postalCode": "66365"
  },
  {
    "id": "d-trg-tugu",
    "regencyId": "r-trg-kab",
    "name": "Tugu",
    "lat": -8.0167,
    "lng": 111.65,
    "postalCode": "66352"
  },
  {
    "id": "d-trg-bendungan",
    "regencyId": "r-trg-kab",
    "name": "Bendungan",
    "lat": -7.9833,
    "lng": 111.7,
    "postalCode": "66351"
  },
  {
    "id": "d-tbn-tuban",
    "regencyId": "r-tbn-kab",
    "name": "Tuban (Bumi Wali)",
    "lat": -6.8967,
    "lng": 112.0647,
    "postalCode": "62311"
  },
  {
    "id": "d-tbn-semanding",
    "regencyId": "r-tbn-kab",
    "name": "Semanding",
    "lat": -6.9278,
    "lng": 112.0528,
    "postalCode": "62381"
  },
  {
    "id": "d-tbn-merakurak",
    "regencyId": "r-tbn-kab",
    "name": "Merakurak",
    "lat": -6.9,
    "lng": 112,
    "postalCode": "62372"
  },
  {
    "id": "d-tbn-jenu",
    "regencyId": "r-tbn-kab",
    "name": "Jenu (Pantura)",
    "lat": -6.8667,
    "lng": 111.9833,
    "postalCode": "62392"
  },
  {
    "id": "d-tbn-tambakboyo",
    "regencyId": "r-tbn-kab",
    "name": "Tambakboyo",
    "lat": -6.8333,
    "lng": 111.9,
    "postalCode": "62391"
  },
  {
    "id": "d-tbn-bancar",
    "regencyId": "r-tbn-kab",
    "name": "Bancar (Perbatasan Jateng)",
    "lat": -6.7833,
    "lng": 111.8,
    "postalCode": "62393"
  },
  {
    "id": "d-tbn-kerek",
    "regencyId": "r-tbn-kab",
    "name": "Kerek (Batik Gedog)",
    "lat": -6.9333,
    "lng": 111.8833,
    "postalCode": "62356"
  },
  {
    "id": "d-tbn-montong",
    "regencyId": "r-tbn-kab",
    "name": "Montong",
    "lat": -6.9833,
    "lng": 111.8667,
    "postalCode": "62357"
  },
  {
    "id": "d-tbn-palang",
    "regencyId": "r-tbn-kab",
    "name": "Palang",
    "lat": -6.9167,
    "lng": 112.1333,
    "postalCode": "62391"
  },
  {
    "id": "d-tbn-widang",
    "regencyId": "r-tbn-kab",
    "name": "Widang",
    "lat": -7.0833,
    "lng": 112.1833,
    "postalCode": "62383"
  },
  {
    "id": "d-tbn-plumpang",
    "regencyId": "r-tbn-kab",
    "name": "Plumpang",
    "lat": -7.05,
    "lng": 112.1,
    "postalCode": "62382"
  },
  {
    "id": "d-tbn-rengel",
    "regencyId": "r-tbn-kab",
    "name": "Rengel",
    "lat": -7.0694,
    "lng": 111.9861,
    "postalCode": "62371"
  },
  {
    "id": "d-tbn-soko",
    "regencyId": "r-tbn-kab",
    "name": "Soko",
    "lat": -7.0833,
    "lng": 111.9167,
    "postalCode": "62372"
  },
  {
    "id": "d-tbn-grabagan",
    "regencyId": "r-tbn-kab",
    "name": "Grabagan",
    "lat": -7,
    "lng": 111.95,
    "postalCode": "62371"
  },
  {
    "id": "d-tbn-singgahan",
    "regencyId": "r-tbn-kab",
    "name": "Singgahan (Nglirip)",
    "lat": -6.9833,
    "lng": 111.8,
    "postalCode": "62353"
  },
  {
    "id": "d-tbn-senori",
    "regencyId": "r-tbn-kab",
    "name": "Senori",
    "lat": -7.0333,
    "lng": 111.7167,
    "postalCode": "62353"
  },
  {
    "id": "d-tbn-bangilan",
    "regencyId": "r-tbn-kab",
    "name": "Bangilan",
    "lat": -7.0167,
    "lng": 111.6667,
    "postalCode": "62364"
  },
  {
    "id": "d-tbn-jatirogo",
    "regencyId": "r-tbn-kab",
    "name": "Jatirogo",
    "lat": -6.95,
    "lng": 111.65,
    "postalCode": "62362"
  },
  {
    "id": "d-tbn-kenduruan",
    "regencyId": "r-tbn-kab",
    "name": "Kenduruan",
    "lat": -7,
    "lng": 111.5833,
    "postalCode": "62363"
  },
  {
    "id": "d-tbn-parengan",
    "regencyId": "r-tbn-kab",
    "name": "Parengan",
    "lat": -7.1,
    "lng": 111.8333,
    "postalCode": "62366"
  },
  {
    "id": "d-tlg-tulungagung",
    "regencyId": "r-tlg-kab",
    "name": "Tulungagung (Kota)",
    "lat": -8.0667,
    "lng": 111.9,
    "postalCode": "66211"
  },
  {
    "id": "d-tlg-kedungwaru",
    "regencyId": "r-tlg-kab",
    "name": "Kedungwaru",
    "lat": -8.0444,
    "lng": 111.9167,
    "postalCode": "66224"
  },
  {
    "id": "d-tlg-ngantru",
    "regencyId": "r-tlg-kab",
    "name": "Ngantru",
    "lat": -8.0167,
    "lng": 111.95,
    "postalCode": "66252"
  },
  {
    "id": "d-tlg-karangrejo",
    "regencyId": "r-tlg-kab",
    "name": "Karangrejo",
    "lat": -8,
    "lng": 111.8833,
    "postalCode": "66253"
  },
  {
    "id": "d-tlg-kauman",
    "regencyId": "r-tlg-kab",
    "name": "Kauman",
    "lat": -8.05,
    "lng": 111.85,
    "postalCode": "66261"
  },
  {
    "id": "d-tlg-pagerwojo",
    "regencyId": "r-tlg-kab",
    "name": "Pagerwojo (Waduk Wonorejo)",
    "lat": -7.9833,
    "lng": 111.7833,
    "postalCode": "66262"
  },
  {
    "id": "d-tlg-sendang",
    "regencyId": "r-tlg-kab",
    "name": "Sendang (Kaki Wilis)",
    "lat": -7.95,
    "lng": 111.8333,
    "postalCode": "66254"
  },
  {
    "id": "d-tlg-gondang",
    "regencyId": "r-tlg-kab",
    "name": "Gondang",
    "lat": -8.0833,
    "lng": 111.85,
    "postalCode": "66263"
  },
  {
    "id": "d-tlg-boyolangu",
    "regencyId": "r-tlg-kab",
    "name": "Boyolangu",
    "lat": -8.1167,
    "lng": 111.8944,
    "postalCode": "66233"
  },
  {
    "id": "d-tlg-sumbergempol",
    "regencyId": "r-tlg-kab",
    "name": "Sumbergempol",
    "lat": -8.1,
    "lng": 111.95,
    "postalCode": "66234"
  },
  {
    "id": "d-tlg-ngunut",
    "regencyId": "r-tlg-kab",
    "name": "Ngunut",
    "lat": -8.1,
    "lng": 111.9833,
    "postalCode": "66292"
  },
  {
    "id": "d-tlg-rejotangan",
    "regencyId": "r-tlg-kab",
    "name": "Rejotangan",
    "lat": -8.1167,
    "lng": 112.05,
    "postalCode": "66293"
  },
  {
    "id": "d-tlg-kalidawir",
    "regencyId": "r-tlg-kab",
    "name": "Kalidawir",
    "lat": -8.1667,
    "lng": 111.9833,
    "postalCode": "66281"
  },
  {
    "id": "d-tlg-pucanglaban",
    "regencyId": "r-tlg-kab",
    "name": "Pucanglaban (Molang)",
    "lat": -8.2333,
    "lng": 112.05,
    "postalCode": "66284"
  },
  {
    "id": "d-tlg-tanggunggunung",
    "regencyId": "r-tlg-kab",
    "name": "Tanggunggunung",
    "lat": -8.2167,
    "lng": 111.9167,
    "postalCode": "66283"
  },
  {
    "id": "d-tlg-campurdarat",
    "regencyId": "r-tlg-kab",
    "name": "Campurdarat (Kerajinan Marmer)",
    "lat": -8.15,
    "lng": 111.8667,
    "postalCode": "66272"
  },
  {
    "id": "d-tlg-pakel",
    "regencyId": "r-tlg-kab",
    "name": "Pakel",
    "lat": -8.1333,
    "lng": 111.8167,
    "postalCode": "66273"
  },
  {
    "id": "d-tlg-bandung",
    "regencyId": "r-tlg-kab",
    "name": "Bandung",
    "lat": -8.15,
    "lng": 111.7667,
    "postalCode": "66274"
  },
  {
    "id": "d-tlg-besuki",
    "regencyId": "r-tlg-kab",
    "name": "Besuki (Pantai Popoh)",
    "lat": -8.2333,
    "lng": 111.8,
    "postalCode": "66275"
  },
  {
    "id": "d-gbr",
    "regencyId": "r-jkt-pusat",
    "name": "Gambir",
    "lat": -6.1767,
    "lng": 106.8286,
    "postalCode": "10110"
  },
  {
    "id": "d-tnh-abg",
    "regencyId": "r-jkt-pusat",
    "name": "Tanah Abang",
    "lat": -6.195,
    "lng": 106.814,
    "postalCode": "10250"
  },
  {
    "id": "d-mtg",
    "regencyId": "r-jkt-pusat",
    "name": "Menteng",
    "lat": -6.1963,
    "lng": 106.8327,
    "postalCode": "10310"
  },
  {
    "id": "d-snn",
    "regencyId": "r-jkt-pusat",
    "name": "Senen",
    "lat": -6.1887,
    "lng": 106.8456,
    "postalCode": "10410"
  },
  {
    "id": "d-kmy",
    "regencyId": "r-jkt-pusat",
    "name": "Kemayoran",
    "lat": -6.1601,
    "lng": 106.855,
    "postalCode": "10610"
  },
  {
    "id": "d-kby-baru",
    "regencyId": "r-jkt-selatan",
    "name": "Kebayoran Baru",
    "lat": -6.2447,
    "lng": 106.7997,
    "postalCode": "12110"
  },
  {
    "id": "d-kby-lama",
    "regencyId": "r-jkt-selatan",
    "name": "Kebayoran Lama",
    "lat": -6.2492,
    "lng": 106.777,
    "postalCode": "12210"
  },
  {
    "id": "d-cld",
    "regencyId": "r-jkt-selatan",
    "name": "Cilandak",
    "lat": -6.2924,
    "lng": 106.7972,
    "postalCode": "12430"
  },
  {
    "id": "d-tbt",
    "regencyId": "r-jkt-selatan",
    "name": "Tebet",
    "lat": -6.2307,
    "lng": 106.8524,
    "postalCode": "12810"
  },
  {
    "id": "d-stb",
    "regencyId": "r-jkt-selatan",
    "name": "Setiabudi",
    "lat": -6.2163,
    "lng": 106.829,
    "postalCode": "12910"
  },
  {
    "id": "d-psr-mg",
    "regencyId": "r-jkt-selatan",
    "name": "Pasar Minggu",
    "lat": -6.2841,
    "lng": 106.8398,
    "postalCode": "12520"
  },
  {
    "id": "d-grogol",
    "regencyId": "r-jkt-barat",
    "name": "Grogol Petamburan",
    "lat": -6.1666,
    "lng": 106.7891,
    "postalCode": "11450"
  },
  {
    "id": "d-kbn-jeruk",
    "regencyId": "r-jkt-barat",
    "name": "Kebon Jeruk",
    "lat": -6.1947,
    "lng": 106.7699,
    "postalCode": "11530"
  },
  {
    "id": "d-cengkareng",
    "regencyId": "r-jkt-barat",
    "name": "Cengkareng",
    "lat": -6.1432,
    "lng": 106.7327,
    "postalCode": "11730"
  },
  {
    "id": "d-jatinegara",
    "regencyId": "r-jkt-timur",
    "name": "Jatinegara",
    "lat": -6.2291,
    "lng": 106.8711,
    "postalCode": "13310"
  },
  {
    "id": "d-duren-sawit",
    "regencyId": "r-jkt-timur",
    "name": "Duren Sawit",
    "lat": -6.2341,
    "lng": 106.915,
    "postalCode": "13440"
  },
  {
    "id": "d-kramat-jati",
    "regencyId": "r-jkt-timur",
    "name": "Kramat Jati",
    "lat": -6.2731,
    "lng": 106.8687,
    "postalCode": "13510"
  },
  {
    "id": "d-klp-gading",
    "regencyId": "r-jkt-utara",
    "name": "Kelapa Gading",
    "lat": -6.1585,
    "lng": 106.9069,
    "postalCode": "14240"
  },
  {
    "id": "d-tg-priok",
    "regencyId": "r-jkt-utara",
    "name": "Tanjung Priok",
    "lat": -6.1287,
    "lng": 106.8837,
    "postalCode": "14310"
  },
  {
    "id": "d-pluit",
    "regencyId": "r-jkt-utara",
    "name": "Penjaringan (Pluit)",
    "lat": -6.1264,
    "lng": 106.7877,
    "postalCode": "14450"
  },
  {
    "id": "d-cbl",
    "regencyId": "r-bdg-kota",
    "name": "Coblong (Dago)",
    "lat": -6.8841,
    "lng": 107.6167,
    "postalCode": "40132"
  },
  {
    "id": "d-skj",
    "regencyId": "r-bdg-kota",
    "name": "Sukajadi (Pasteur)",
    "lat": -6.8832,
    "lng": 107.5921,
    "postalCode": "40162"
  },
  {
    "id": "d-ccd",
    "regencyId": "r-bdg-kota",
    "name": "Cicendo",
    "lat": -6.9056,
    "lng": 107.5982,
    "postalCode": "40171"
  },
  {
    "id": "d-bdg-wetan",
    "regencyId": "r-bdg-kota",
    "name": "Bandung Wetan (Riau)",
    "lat": -6.9042,
    "lng": 107.6191,
    "postalCode": "40115"
  },
  {
    "id": "d-lengkong",
    "regencyId": "r-bdg-kota",
    "name": "Lengkong",
    "lat": -6.9325,
    "lng": 107.6256,
    "postalCode": "40261"
  },
  {
    "id": "d-regol",
    "regencyId": "r-bdg-kota",
    "name": "Regol",
    "lat": -6.9367,
    "lng": 107.6083,
    "postalCode": "40252"
  },
  {
    "id": "d-soreang",
    "regencyId": "r-bdg-kab",
    "name": "Soreang",
    "lat": -7.0264,
    "lng": 107.5186,
    "postalCode": "40911"
  },
  {
    "id": "d-baleendah",
    "regencyId": "r-bdg-kab",
    "name": "Baleendah",
    "lat": -6.9947,
    "lng": 107.6269,
    "postalCode": "40375"
  },
  {
    "id": "d-cileunyi",
    "regencyId": "r-bdg-kab",
    "name": "Cileunyi",
    "lat": -6.9367,
    "lng": 107.7472,
    "postalCode": "40622"
  },
  {
    "id": "d-bgr-tengah",
    "regencyId": "r-bgr-kota",
    "name": "Bogor Tengah",
    "lat": -6.5971,
    "lng": 106.7997,
    "postalCode": "16121"
  },
  {
    "id": "d-cibinong",
    "regencyId": "r-bgr-kab",
    "name": "Cibinong",
    "lat": -6.4817,
    "lng": 106.8542,
    "postalCode": "16911"
  },
  {
    "id": "d-bks-barat",
    "regencyId": "r-bks-kota",
    "name": "Bekasi Barat",
    "lat": -6.2361,
    "lng": 106.9856,
    "postalCode": "17145"
  },
  {
    "id": "d-ckr-pusat",
    "regencyId": "r-bks-kab",
    "name": "Cikarang Pusat",
    "lat": -6.3456,
    "lng": 107.1689,
    "postalCode": "17530"
  },
  {
    "id": "d-pancoran-mas",
    "regencyId": "r-dpk-kota",
    "name": "Pancoran Mas (Margonda)",
    "lat": -6.3986,
    "lng": 106.8189,
    "postalCode": "16431"
  },
  {
    "id": "d-smg-tengah",
    "regencyId": "r-smg-kota",
    "name": "Semarang Tengah (Simpang Lima)",
    "lat": -6.9822,
    "lng": 110.4228,
    "postalCode": "50134"
  },
  {
    "id": "d-banyumanik",
    "regencyId": "r-smg-kota",
    "name": "Banyumanik",
    "lat": -7.0706,
    "lng": 110.4286,
    "postalCode": "50264"
  },
  {
    "id": "d-banjarsari",
    "regencyId": "r-slo-kota",
    "name": "Banjarsari (Solo)",
    "lat": -7.5517,
    "lng": 110.8258,
    "postalCode": "57139"
  },
  {
    "id": "d-malioboro",
    "regencyId": "r-yog-kota",
    "name": "Gedongtengen (Malioboro)",
    "lat": -7.7925,
    "lng": 110.3639,
    "postalCode": "55271"
  },
  {
    "id": "d-depok-slm",
    "regencyId": "r-slm-kab",
    "name": "Depok (Sleman)",
    "lat": -7.7667,
    "lng": 110.4,
    "postalCode": "55281"
  },
  {
    "id": "d-tgr-kota",
    "regencyId": "r-tgr-kota",
    "name": "Tangerang (Kota)",
    "lat": -6.1783,
    "lng": 106.6319,
    "postalCode": "15111"
  },
  {
    "id": "d-serpong",
    "regencyId": "r-tgs-kota",
    "name": "Serpong (BSD City)",
    "lat": -6.3117,
    "lng": 106.6694,
    "postalCode": "15310"
  },
  {
    "id": "d-dps-selatan",
    "regencyId": "r-dps-kota",
    "name": "Denpasar Selatan (Sanur)",
    "lat": -8.6947,
    "lng": 115.2289,
    "postalCode": "80227"
  },
  {
    "id": "d-kuta",
    "regencyId": "r-bdg-bali-kab",
    "name": "Kuta (Legian & Seminyak)",
    "lat": -8.7233,
    "lng": 115.1725,
    "postalCode": "80361"
  },
  {
    "id": "d-mdn-kota",
    "regencyId": "r-mdn-kota",
    "name": "Medan Kota",
    "lat": 3.5852,
    "lng": 98.6811,
    "postalCode": "20212"
  },
  {
    "id": "d-mks-ujungpandang",
    "regencyId": "r-mks-kota",
    "name": "Ujung Pandang (Makassar)",
    "lat": -5.1354,
    "lng": 119.4124,
    "postalCode": "90111"
  },
  {
    "id": "d-bpn-balikpapan",
    "regencyId": "r-bpn-kota",
    "name": "Balikpapan Kota",
    "lat": -1.2654,
    "lng": 116.8312,
    "postalCode": "76111"
  },
  {
    "id": "d-mtr-mataram",
    "regencyId": "r-mtr-kota",
    "name": "Mataram",
    "lat": -8.5833,
    "lng": 116.1167,
    "postalCode": "83121"
  }
];

// Helper functions
export const getProvinces = (): Province[] => INDONESIA_PROVINCES;

export const getRegenciesByProvince = (provinceId: string): Regency[] => {
  return INDONESIA_REGENCIES.filter(r => r.provinceId === provinceId);
};

export const getDistrictsByRegency = (regencyId: string): District[] => {
  return INDONESIA_DISTRICTS.filter(d => d.regencyId === regencyId);
};

export const getDistrictById = (districtId: string): District | undefined => {
  return INDONESIA_DISTRICTS.find(d => d.id === districtId);
};

export const getFullLocationHierarchy = (districtId: string) => {
  const district = INDONESIA_DISTRICTS.find(d => d.id === districtId);
  if (!district) return null;
  const regency = INDONESIA_REGENCIES.find(r => r.id === district.regencyId);
  if (!regency) return null;
  const province = INDONESIA_PROVINCES.find(p => p.id === regency.provinceId);
  return {
    province,
    regency,
    district,
    label: `Kec. ${district.name}, ${regency.name}, ${province?.name || ''}`
  };
};

/**
 * Menghitung jarak akurat dalam KM menggunakan Haversine Formula + Faktor Jalan Raya (1.28x)
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius bumi dalam KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;
  const roadDistance = Math.max(1.5, Math.round(straightDistance * 1.28 * 10) / 10);
  return roadDistance;
};

/**
 * Pencarian instan kecamatan dengan autocomplete lengkap
 */
export const searchDistricts = (query: string): (District & { label: string; provinceName: string; regencyName: string })[] => {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  return INDONESIA_DISTRICTS.map(d => {
    const reg = INDONESIA_REGENCIES.find(r => r.id === d.regencyId);
    const prov = reg ? INDONESIA_PROVINCES.find(p => p.id === reg.provinceId) : undefined;
    const label = `Kec. ${d.name}, ${reg?.name || ''}, ${prov?.name || ''}`;
    return {
      ...d,
      label,
      regencyName: reg?.name || '',
      provinceName: prov?.name || ''
    };
  }).filter(item => 
    item.name.toLowerCase().includes(q) ||
    item.regencyName.toLowerCase().includes(q) ||
    item.provinceName.toLowerCase().includes(q) ||
    item.postalCode.includes(q)
  );
};
