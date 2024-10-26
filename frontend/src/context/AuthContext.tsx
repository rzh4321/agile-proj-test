import { Store, SavedRoute } from "@/types";
import React, { useState, useEffect, createContext, useContext } from "react";

type User = {
  id: string;
  username: string;
  routes: SavedRoute[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  verifyToken: () => Promise<void>;
  loading: boolean;
};

const sampleStores: Store[] = [
  {
    _id: "1",
    name: "Uniqlo",
    address: "123 Fashion St, New York, NY 10001",
    reviews: [
      "5_Excellent quality basics at affordable prices. The store layout is clean and easy to navigate._Fashion Enthusiast",
      "4_Great for essentials, but sometimes sizes run out quickly._Casual Shopper",
    ],
    categories: ["Clothing", "Accessories"],
    priceRange: "Budget",
    description: "Japanese casual wear designer, manufacturer and retailer",
    photos: Array(5).fill(
      "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
    ),
    brand: "Uniqlo",
    rating: 4.5,
    googleMapsURI: "https://www.google.com",
    phoneNumber: "+1 (212) 555-1234",
    paymentOptions: {
      acceptsCashOnly: "false",
      acceptsCreditCards: "true",
      acceptsDebitCards: "true",
      acceptsNFC: "true",
    },
    openingHours:
      "Monday: 9:30 AM – 5:00 PM\nTuesday: 9:30 AM – 5:00 PM\nWednesday: 9:30 AM – 5:00 PM\nThursday: 9:30 AM – 5:00 PM\nFriday: 9:30 AM – 5:00 PM\nSaturday: 9:30 AM – 5:00 PM\nSunday: 9:30 AM – 5:00 PM",
    ratingCount: 1000,
    websiteURI: "https://www.google.com",
    lat: 40.72350481205159,
    lng: -73.99820330940372,
  },
  {
    _id: "1",
    name: "Uniqlo",
    address: "123 Fashion St, New York, NY 10001",
    reviews: [
      "5_Excellent quality basics at affordable prices. The store layout is clean and easy to navigate._Fashion Enthusiast",
      "4_Great for essentials, but sometimes sizes run out quickly._Casual Shopper",
    ],
    categories: ["Clothing", "Accessories"],
    priceRange: "Budget",
    description: "Japanese casual wear designer, manufacturer and retailer",
    photos: Array(5).fill(
      "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
    ),
    brand: "Uniqlo",
    rating: 4.5,
    googleMapsURI: "https://www.google.com",
    phoneNumber: "+1 (212) 555-1234",
    paymentOptions: {
      acceptsCashOnly: "false",
      acceptsCreditCards: "true",
      acceptsDebitCards: "true",
      acceptsNFC: "true",
    },
    openingHours:
      "Monday: 9:30 AM – 5:00 PM\nTuesday: 9:30 AM – 5:00 PM\nWednesday: 9:30 AM – 5:00 PM\nThursday: 9:30 AM – 5:00 PM\nFriday: 9:30 AM – 5:00 PM\nSaturday: 9:30 AM – 5:00 PM\nSunday: 9:30 AM – 5:00 PM",
    ratingCount: 1000,
    websiteURI: "https://www.google.com",
    lat: 40.72350481205159,
    lng: -73.99820330940372,
  },
  {
    _id: "1",
    name: "Uniqlo",
    address: "123 Fashion St, New York, NY 10001",
    reviews: [
      "5_Excellent quality basics at affordable prices. The store layout is clean and easy to navigate._Fashion Enthusiast",
      "4_Great for essentials, but sometimes sizes run out quickly._Casual Shopper",
    ],
    categories: ["Clothing", "Accessories"],
    priceRange: "Budget",
    description: "Japanese casual wear designer, manufacturer and retailer",
    photos: Array(5).fill(
      "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
    ),
    brand: "Uniqlo",
    rating: 4.5,
    googleMapsURI: "https://www.google.com",
    phoneNumber: "+1 (212) 555-1234",
    paymentOptions: {
      acceptsCashOnly: "false",
      acceptsCreditCards: "true",
      acceptsDebitCards: "true",
      acceptsNFC: "true",
    },
    openingHours:
      "Monday: 9:30 AM – 5:00 PM\nTuesday: 9:30 AM – 5:00 PM\nWednesday: 9:30 AM – 5:00 PM\nThursday: 9:30 AM – 5:00 PM\nFriday: 9:30 AM – 5:00 PM\nSaturday: 9:30 AM – 5:00 PM\nSunday: 9:30 AM – 5:00 PM",
    ratingCount: 1000,
    websiteURI: "https://www.google.com",
    lat: 40.72350481205159,
    lng: -73.99820330940372,
  },
  {
    _id: "2",
    name: "Bloomingdale's",
    address: "504 Broadway, New York, NY 10012",
    reviews: [
      "5_The ultimate streetwear destination. Limited drops are always exciting._Streetwear Fanatic",
      "3_Cool products but the hype can be overwhelming._Casual Observer",
    ],
    categories: ["Streetwear", "Accessories"],
    priceRange: "Premium",
    description: "Iconic streetwear brand with limited edition drops",
    photos: Array(5).fill(
      "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
    ),
    brand: "Supreme",
    rating: 4.2,
    googleMapsURI: "https://www.google.com",
    phoneNumber: "+1 (212) 555-5678",
    paymentOptions: {
      acceptsCashOnly: "false",
      acceptsCreditCards: "true",
      acceptsDebitCards: "true",
      acceptsNFC: "true",
    },
    openingHours:
      "Monday: 9:30 AM – 5:00 PM\nTuesday: 9:30 AM – 5:00 PM\nWednesday: 9:30 AM – 5:00 PM\nThursday: 9:30 AM – 5:00 PM\nFriday: 9:30 AM – 5:00 PM\nSaturday: 9:30 AM – 5:00 PM\nSunday: 9:30 AM – 5:00 PM",
    ratingCount: 800,
    websiteURI: "https://www.google.com",
    lat: 40.72253053381597,
    lng: -73.99919787001336,
  },
  {
    _id: "10",
    name: "Sephora",
    address: "789 Beauty Blvd, New York, NY 10010",
    reviews: [
      "5_Heaven for beauty lovers! Great selection and helpful staff._Makeup Enthusiast",
      "4_Good variety but can be pricey. Love the samples though!_Beauty Novice",
    ],
    categories: ["Beauty", "Cosmetics", "Skincare"],
    priceRange: "Premium",
    description: "Multinational chain of personal care and beauty stores",
    photos: Array(5).fill(
      "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
    ),
    brand: "Sephora",
    rating: 4.7,
    googleMapsURI: "https://www.google.com",
    phoneNumber: "+1 (212) 555-9012",
    paymentOptions: {
      acceptsCashOnly: "false",
      acceptsCreditCards: "true",
      acceptsDebitCards: "true",
      acceptsNFC: "true",
    },
    openingHours:
      "Monday: 9:30 AM – 5:00 PM\nTuesday: 9:30 AM – 5:00 PM\nWednesday: 9:30 AM – 5:00 PM\nThursday: 9:30 AM – 5:00 PM\nFriday: 9:30 AM – 5:00 PM\nSaturday: 9:30 AM – 5:00 PM\nSunday: 9:30 AM – 5:00 PM",
    ratingCount: 1200,
    websiteURI: "https://www.google.com",
    lat: 40.725276859503744,
    lng: -73.9946275815265,
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const verifyToken = async (): Promise<void> => {
    setLoading(true); // auth status is loading
    console.log("in verifytoken, localstorage is ", localStorage);
    const token = localStorage.getItem("token");
    if (token) {
      console.log(
        "token detected in localstorage, verifying it in backend now...",
      );
      try {
        const response = await fetch(
          "http://localhost:3001/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          console.log("token authenticated. ur now authenticated");
          const userData: User = await response.json();
          // TODO: delete this later
          const temp = {
            ...userData,
            routes: [
              {
                id: "1",
                description: "desc",
                name: "saved route 1",
                stores: sampleStores,
              },
              {
                id: "2",
                description: "desc",
                name: "saved route 2",
                stores: sampleStores,
              },
            ],
          };
          setIsAuthenticated(true);
          // setUser(userData);
          setUser(temp);
        } else {
          console.log("token NOT authenticaed. ur logged out now");
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error("Token verification error:", error);
        logout();
      } finally {
        setLoading(false); // auth status is determined
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    console.log("calling verifytoken...");
    verifyToken();
  }, [isAuthenticated]);

  const login = (token: string): void => {
    console.log("login called.  token stored to localstorage");
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    verifyToken,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
