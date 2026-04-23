import type {
  ListingTier,
  MotoCategory,
  ServiceCategory,
  ListingType,
  Transmission,
  FuelType,
  LicenseCategory,
} from "@/types";

export const MOTO_MAKES = [
  "Yamaha", "Honda", "Kawasaki", "Suzuki", "BMW", "Ducati",
  "Harley-Davidson", "Triumph", "KTM", "Aprilia", "Royal Enfield", "Husqvarna",
];
export const SCOOTER_MAKES = [
  "Vespa", "Piaggio", "Yamaha", "Honda", "Kymco", "SYM", "Aprilia", "Suzuki", "Lambretta",
];
export const ALL_MAKES = Array.from(new Set([...MOTO_MAKES, ...SCOOTER_MAKES])).sort();

export const GEL_USD_RATE = 2.72;

// ============== labels (Georgian) ==============

export const CATEGORY_LABEL: Record<MotoCategory, string> = {
  sport: "სპორტული",
  cruiser: "კრუიზერი",
  adventure: "ედვენჩერი",
  naked: "ნეიკედი",
  touring: "ტურისტული",
  dirt: "ენდურო/კროსი",
  scooter: "სკუტერი",
};

export const SERVICE_CATEGORY_LABEL: Record<ServiceCategory, string> = {
  repair: "შეკეთება",
  electrical: "ელექტროობა",
  detailing: "დეტეილინგი",
  tires: "საბურავები",
  painting: "სამღებრო",
  tuning: "ტიუნინგი",
};

export const TRANSMISSION_LABEL: Record<Transmission, string> = {
  manual: "მექანიკა",
  automatic: "ავტომატიკა",
  dct: "DCT",
};

export const FUEL_LABEL: Record<FuelType, string> = {
  petrol: "ბენზინი",
  electric: "ელექტრო",
  hybrid: "ჰიბრიდი",
};

export const LICENSE_LABEL: Record<LicenseCategory, string> = {
  AM: "AM",
  A1: "A1",
  A2: "A2",
  A: "A",
};

export const LISTING_TYPE_LABEL: Record<ListingType, string> = {
  sale: "იყიდება",
  rent: "ქირავდება",
  service: "სერვისი",
};

// ============== Pricing tiers ==============

export interface TierPlan {
  id: ListingTier;
  name: string;
  tagline: string;
  price: number;
  currency: "GEL";
  duration: string;
  features: string[];
  highlights: string[];
  popular?: boolean;
  premium?: boolean;
}

export const TIER_PLANS: TierPlan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "სტანდარტული განცხადება",
    price: 0,
    currency: "GEL",
    duration: "30 დღე",
    features: [
      "სტანდარტული პოზიცია სიაში",
      "10 ფოტოს ატვირთვა",
      "კონტაქტი მყიდველებთან",
      "30 დღიანი აქტივობა",
    ],
    highlights: ["უფასო"],
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "გამოყოფილი განცხადება",
    price: 19,
    currency: "GEL",
    duration: "30 დღე",
    popular: true,
    features: [
      "VIP ნიშანი და ჩარჩო",
      "უფრო მაღალი პოზიცია სიაში",
      "30 ფოტოს ატვირთვა",
      "სტატისტიკის ხელმისაწვდომობა",
      "ნახვების ანალიტიკა",
    ],
    highlights: ["პოპულარული"],
  },
  {
    id: "super_vip",
    name: "Super VIP",
    tagline: "მაქსიმალური დანახვა",
    price: 49,
    currency: "GEL",
    duration: "30 დღე",
    premium: true,
    features: [
      "მთავარ გვერდზე გამოყოფა",
      "Super VIP ნიშანი (მწვანე)",
      "ყოველდღიური ავტომატური განახლება",
      "ულიმიტო ფოტოები",
      "პრიორიტეტული მხარდაჭერა",
      "სოც.ქსელებში ავტო-პოსტინგი",
    ],
    highlights: ["პრემიუმი"],
  },
];

export const TIER_LABEL: Record<ListingTier, string> = {
  basic: "Basic",
  vip: "VIP",
  super_vip: "Super VIP",
};
