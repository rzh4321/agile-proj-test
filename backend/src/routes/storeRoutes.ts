import express from "express";
import Store from "../models/Store";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const {
      placeId,
      name,
      address,
      reviews,
      categories,
      priceRange,
      description,
      photos,
      brand,
      rating,
      googleMapsURI,
      phoneNumber,
      paymentOptions,
      openingHours,
      ratingCount,
      websiteURI,
      lat,
      lng,
    } = req.body;
    console.log(typeof placeId);
    // check if a store with the same name already exists
    const existingStore = await Store.findById(placeId);
    // const existingStore = await Store.findOne({ name: name });
    if (existingStore) {
      return res
        .status(409)
        .json({ message: "A store with this place ID already exists" });
    }

    const newStore = new Store({
      _id: placeId,
      name: name || "Unnamed Store",
      address: address || "Address not provided",
      reviews: reviews || [
        "5_This is definitely world class zoo and a great way to close and personal with animals. Usually a zoo this size is far away from the city center but this zoo is just a short ferry away. The zoo itself is like a scenic hike with a great view of the city. The seal show definitely is the headliner but there are so many different animals to make a great day trip._World Explorer",
        "5_This is definitely world class zoo and a great way to close and personal with animals. Usually a zoo this size is far away from the city center but this zoo is just a short ferry away. The zoo itself is like a scenic hike with a great view of the city. The seal show definitely is the headliner but there are so many different animals to make a great day trip._World Explorer",
      ],
      categories: categories || ["Uncategorized"],
      priceRange: priceRange || "Mid-Range",
      description:
        description ||
        "Retail chain selling a range of grocery items, meat & dairy.",
      photos: photos || [
        "https://corporate.target.com/getmedia/d2441ab3-7b0b-4bff-9a6f-15df4690559d/New-Stores_Header_Target.png?width=620",
      ],
      brand: brand || "Some Brand",
      rating: rating || 0,
      googleMapsURI: googleMapsURI || "google.com",
      phoneNumber: phoneNumber || "Not provided",
      paymentOptions:
        paymentOptions === null
          ? {
              acceptsCashOnly: "N/A",
              acceptsCreditCards: "N/A",
              acceptsDebitCards: "N/A",
              acceptsNFC: "N/A",
            }
          : {
              acceptsCashOnly: paymentOptions.acceptsCashOnly ?? false,
              acceptsCreditCards: paymentOptions.acceptsCreditCards ?? false,
              acceptsDebitCards: paymentOptions.acceptsDebitCards ?? false,
              acceptsNFC: paymentOptions.acceptsNFC ?? false,
            },
      openingHours:
        openingHours ||
        `Monday: 9:30 AM – 5:00 PM
Tuesday: 9:30 AM – 5:00 PM
Wednesday: 9:30 AM – 5:00 PM
Thursday: 9:30 AM – 5:00 PM
Friday: 9:30 AM – 5:00 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM`,
      ratingCount: ratingCount || 0,
      websiteURI: websiteURI || "google.com",
      lat: lat,
      lng: lng,
    });

    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(500).json({ message: `Error creating store ${error}` });
  }
});

export default router;
