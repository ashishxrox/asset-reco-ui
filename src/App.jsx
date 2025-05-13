import React, { useState, useEffect } from 'react';
import Chatbot from './components/chatbot/Chatbot';
import LocationSelector from './components/locationSelector/LocationSelector';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [assetList, setAssetList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatReady, setChatReady] = useState(false); // NEW state
  const asset_type_desc = [
    {
      "name": "Elevator Branding",
      "description": "Ads placed inside elevators of residential or commercial buildings to capture attention in a captive, enclosed environment."
    },
    {
      "name": "Gate Branding",
      "description": "Brand signage at entry/exit gates of communities or venues, ensuring maximum visibility to all incoming and outgoing traffic."
    },
    {
      "name": "Notice Boards",
      "description": "Information or promotional material placed on shared boards in societies or offices, viewed as a trusted communication channel."
    },
    {
      "name": "Standees",
      "description": "Vertical banners or displays used at entrances, lobbies, or events to highlight a brand or offer in a cost-efficient, movable format."
    },
    {
      "name": "Kiosk",
      "description": "A small setup where brand representatives interact directly with audiences for demos, registrations, or sampling."
    },
    {
      "name": "Events",
      "description": "Community or brand-led gatherings that allow immersive engagement, lead generation, and product showcasing."
    },
    {
      "name": "Silent D2D",
      "description": "Flyers, hangers, or stickers left at doorsteps without interaction, ideal for soft yet personalized outreach."
    },
    {
      "name": "Carnival",
      "description": "A festive event with stalls, games, and performances, creating a fun setting for brand interaction with families and kids."
    },
    {
      "name": "Car / Bike Displays",
      "description": "Vehicles used as moving billboards or parked at strategic spots to maximize brand visibility on the go."
    },
    {
      "name": "Community Newsletter",
      "description": "Branded content in monthly or weekly community bulletins, reaching residents directly in a trusted, informative format."
    },
    {
      "name": "Message Rollout",
      "description": "Targeted SMS, WhatsApp, or push notifications to residents or users, useful for direct communication and offers."
    },
    {
      "name": "Emailer",
      "description": "Branded emails sent to a segmented audience, often used for campaigns, offers, or updates with measurable engagement."
    },
    {
      "name": "Club House",
      "description": "Brand presence in community clubhouses\u2014ideal for reaching affluent residents during recreational activities."
    },
    {
      "name": "Flea Market",
      "description": "Pop-up stalls in community events or malls, giving brands the chance to showcase, sell, or demo products in a lively atmosphere."
    },
    {
      "name": "Workshop",
      "description": "Hands-on learning sessions or brand-sponsored events that engage users deeply around a theme or product."
    },
    {
      "name": "Digital Screens & Displays",
      "description": "TVs or LED screens in residential, retail, or transit spaces playing dynamic brand videos or messages."
    },
    {
      "name": "Outdoor Signage",
      "description": "Large-format static ads like banners or boards placed in high-traffic outdoor areas."
    },
    {
      "name": "Indoor Signage",
      "description": "Posters, cutouts, or boards displayed inside buildings or retail areas to guide or inform with branded messaging."
    },
    {
      "name": "Vehical Wraps",
      "description": "Full or partial branding on cars, vans, or buses that turn vehicles into mobile advertisements."
    },
    {
      "name": "Public Space Ads",
      "description": "Brand placements in high-footfall public areas like parks, streets, or government spaces."
    },
    {
      "name": "Sponsorship",
      "description": "Brand association with an event or segment, often with name integration and prominent visibility."
    },
    {
      "name": "Stage Banner",
      "description": "Branded banners or backdrops on event stages, ensuring high visibility during performances or speeches."
    },
    {
      "name": "Main Stage Branding",
      "description": "Premium branding across the event’s main performance or talk stage—ideal for top-tier visibility."
    },
    {
      "name": "Stall or Booth Spaces",
      "description": "Designated branded spaces at events or expos where brands can engage visitors directly."
    },
    {
      "name": "LED Screens",
      "description": "High-resolution digital screens at events displaying sponsor ads, schedules, or interactive content."
    },
    {
      "name": "Entry & Exit Archways",
      "description": "Designated branded spaces at events or expos where brands can engage visitors directly."
    },
    {
      "name": "Lanyard & Badge Sponsor",
      "description": "Sponsor logos featured on attendee badges or lanyards, offering continuous visibility throughout the event."
    },
    {
      "name": "Floor Graphics & Walkway Branding",
      "description": "Stickers or visual cues placed on floors to guide attendees while reinforcing brand identity."
    },
    {
      "name": "Event Programs & Schedules",
      "description": "Brand visibility through printed or digital event itineraries distributed to attendees."
    },
    {
      "name": "Wristbands",
      "description": "Branded wristbands given to attendees for access or identification—providing wearable brand exposure."
    },
    {
      "name": "Stall or Booth Spaces",
      "description": "Designated branded spaces at events or expos where brands can engage visitors directly."
    },
    {
      "name": "Interactive Zones",
      "description": "Engagement booths with games, VR/AR, or brand activities to attract and immerse users."
    },
    {
      "name": "Photo Booths",
      "description": "Branded photo spots where attendees click pictures, generating organic social sharing."
    },
    {
      "name": "Food & Beverage Partner",
      "description": "Branding on or around food stalls or menus, with sampling or logo placement."
    },
    {
      "name": "Swag Bags & Merchandise",
      "description": "Branded goodies or merchandise given to attendees as takeaways, offering lasting recall."
    },
    {
      "name": "Seating Area Branding",
      "description": "Logos or messages displayed on or near audience seating to ensure constant brand presence."
    },
    {
      "name": "Restroom Branding",
      "description": "Creative branding in restrooms at events, catching users’ attention in a captive environment."
    },
    {
      "name": "Event Apps & Digital Assets",
      "description": "Sponsor placement within event apps, push notifications, or digital tickets to ensure digital touchpoint exposure."
    },
    {
      "name": "Charging Stations",
      "description": "Branded mobile charging zones at events, offering utility while promoting amessage."
    },
    {
      "name": "Workshop Sponsor",
      "description": "Sponsorship of hands-on learning or demo zones, with co-branding and verbal mentions."
    },
    {
      "name": "Title Sponsor",
      "description": "Top-tier sponsor with branding across all touchpoints, communication, and naming rights."
    },
    {
      "name": "Associate Sponsor",
      "description": "Mid-level sponsor with shared visibility across event properties."
    },
    {
      "name": "Co-Title Sponsor",
      "description": "Shared primary sponsorship slot, often co-branded with the title sponsor."
    },
    {
      "name": "VR/AR Experiences",
      "description": "Immersive branded experiences using virtual or augmented reality to drive engagement and recall."
    },
    {
      "name": "WiFi Landing Page Ads",
      "description": "Branded ads on public Wi-Fi login pages, ensuring every user sees the brand before accessing the internet."
    },
    {
      "name": "Billboards & Hoardings",
      "description": "Large outdoor displays placed at highways, streets, or near buildings for mass awareness."
    },
    {
      "name": "LED Video Walls",
      "description": "Bright, dynamic digital walls used for high-impact advertising in malls or busy urban areas."
    },
    {
      "name": "Floor Graphics",
      "description": "Strategically placed visual ads on floors to drive directional branding and foot traffic."
    },
    {
      "name": "Storefront Lightboxes",
      "description": "Backlit displays on store exteriors that highlight brands even during night hours."
    },
    {
      "name": "Digi-Pods",
      "description": "Digital kiosks or pods in malls or airports that show interactive brand content."
    },
    {
      "name": "Trolley & Basket Branding",
      "description": "Brand messaging on shopping carts or baskets in supermarkets for visibility during the purchase journey."
    },
    {
      "name": "Pillar Branding",
      "description": "Wrapping or signage around structural pillars in malls or public areas to maximize attention."
    },
    {
      "name": "Fountain Branding",
      "description": "Creative brand displays integrated with public or mall fountains to surprise and engage."
    },
    {
      "name": "Parking Space Branding",
      "description": "Ads placed in or near parking lots to capture attention of vehicle owners or passersby."
    },
    {
      "name": "Info Desk & Help Kiosk Branding",
      "description": "Branding on customer help desks or info counters to gain attention where people seek assistance."
    },
    {
      "name": "Lounge & Seating Area Branding",
      "description": "Ads placed in relaxation zones or waiting areas where people spend time, ensuring better brand absorption."
    },
    {
      "name": "Sampling Booths",
      "description": "Dedicated spots where users can try products, creating direct interaction and feedback opportunities."
    },
    {
      "name": "Mall Radio Spots",
      "description": "Audio ads played over the mall’s PA system to engage shoppers without visual distraction."
    },
    {
      "name": "Event Spaces",
      "description": "Temporary or permanent locations within malls or campuses available for full-fledged brand activation."
    },
    {
      "name": "Pop-Up Store Spaces",
      "description": "Short-term branded retail installations that allow immersive brand experiences or product trials."
    },
  
    {
      "name": "Escalator Branding",
      "description": "Ads on escalator panels or rails, capturing attention during movement across floors."
    },
    {
      "name": "Tea Stalls",
      "description": "Branding at local tea shops or kiosks to reach mass and repeat customers in casual settings."
    },
    {
      "name": "Supermarkets",
      "description": "In-store branding or activation in grocery and retail stores where buying decisions happen."
    },
    {
      "name": "Car Showrooms",
      "description": "Brand placement in or around car dealerships, reaching a premium, purchase-intent audience."
    },
    {
      "name": "Bus Stops",
      "description": "Ads at or around public transport waiting points, ensuring repeated views by commuters."
    },
    {
      "name": "Hospitals",
      "description": "Ads or awareness campaigns in waiting areas, pharmacies, or entrances of medical facilities."
    },
    {
      "name": "Railway Stations",
      "description": "Branded hoardings, standees, or audio in stations to engage long-distance or daily travelers."
    },
    {
      "name": "Religious Places",
      "description": "Subtle and respectful branding near temples, mosques, or churches to reach deeply connected communities."
    },
    {
      "name": "Gymnasiums and Fitness Centers",
      "description": "Fitness-related branding in gyms or studios, reaching health-conscious audiences."
    },
    {
      "name": "Food Courts",
      "description": "Tabletops, tray liners, or display ads in shared eating areas within malls or campuses."
    },
    {
      "name": "Fuel Stations",
      "description": "Branding on pump stations, digital screens, or nozzles targeting drivers during refueling."
    },
    {
      "name": "Weekly Markets and Bazaars",
      "description": "Traditional markets with pop-up stalls or flyers offering local brand exposure."
    },
    {
      "name": "Sports Stadiums",
      "description": "Billboards, LED displays, or sponsorships inside stadiums—ideal for wide visibility among engaged audiences."
    },
    {
      "name": "Airports",
      "description": "High-end branding in lounges, baggage claims, or boarding areas to target premium travelers."
    },
    {
      "name": "Cinema Halls and Multiplexes",
      "description": "Ads before or during movies, or branding in lobbies and snack counters to engage a relaxed audience."
    },
    {
      "name": "Corporate Offices",
      "description": "Internal branding or activations in tech parks or offices to reach working professionals."
    },
    {
      "name": "Platinum Sponsor",
      "description": "Highest level of sponsorship with maximum visibility and naming rights across all event materials."
    },
    {
      "name": "Gold Sponsor",
      "description": "Premium sponsorship tier with significant but slightly limited exposure compared to platinum."
    },
    {
      "name": "Silver Sponsor",
      "description": "Standard sponsorship package with moderate branding across selected properties."
    },
    {
      "name": "Networking Zone Sponsor",
      "description": "Sponsor of the event’s networking area where professionals connect—ideal for B2B visibility."
    },
    {
      "name": "Entertainment Sponsor",
      "description": "Sponsor of performances, games, or concerts during an event for high-energy brand association."
    },
    {
      "name": "Startup Pitch Arena",
      "description": "Branding opportunity around a stage or space dedicated to startups showcasing ideas."
    },
    {
      "name": "Eco-Friendly Sponsor",
      "description": "Sponsorship of sustainability initiatives like recycling booths or green decor—ideal for environmentally conscious branding."
    },
    {
      "name": "Tech Zone Sponsor",
      "description": "Sponsor for zones dedicated to innovation and tech—great for positioning cutting-edge products."
    },
    {
      "name": "City/ Regional Partner",
      "description": "Localized sponsorship status indicating exclusive association with a city or region within an event."
    },
    {
      "name": "Media Partner",
      "description": "Co-branding rights with event media, including publications, interviews, and live coverage."
    },
    {
      "name": "Event App Sponsor",
      "description": "Exclusive branding inside the event's official app via banners, messages, and push notifications."
    },
    {
      "name": "Logistics Sponsor",
      "description": "Branding via transportation, movement, or delivery-related services at events—great for logistic or delivery companies."
    },
    {
      "name": "Conference Rooms",
      "description": "Branded business rooms in events or hotels where meetings and sessions are held—ideal for serious B2B visibility."
    },
     
  ]

  // const APIurl = "https://devapi.monetez.com/api/univerze/v1/init-chat" 
  const APIurl = "http://localhost:8000/api/univerze/v1/init-chat" 

  const handleLocationSelect = async (locationId) => {
    setIsLoading(true);
    setChatReady(false); // Reset chat UI until init is done

    try {
      const response = await fetch('https://devapi.monetez.com/api/univerze/v1/assetsforMediaPlanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: locationId }),
      });

      const data = await response.json();
      const formatted = formatAssetsList(data?.data || []);
      setAssetList(formatted);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
      setIsLoading(false);
    }
  };

  function formatAssetsList(assets) {
    return (assets || []).map(asset => {
      const typeDesc = asset_type_desc.find(type => type.name === asset.asset_type_name);
      const description = typeDesc ? typeDesc.description : 'No description available';
  
      return `- Asset Name: ${asset.asset_name} | Asset Rate: ₹${asset.rate} | Asset Details: ${asset.details || 'N/A'} | Asset Location: ${asset.company_name} | Frequency: ${asset.frequency || 'N/A'} | Reach: ${asset.reach || 'N/A'} | Asset Type: ${asset.asset_type_name || 'N/A'} | Quantity: ${asset.quantity || 'N/A'} | Type Description: ${description}`;
    }).join('\n');
  }

  // 🧠 React to changes in assetList
  useEffect(() => {
    const initChat = async () => {
      if (!assetList) return;
  
      try {
        const res = await fetch(APIurl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asset_list: assetList }),
        });
  
        if (!res.ok) throw new Error('Init chat API failed');
  
        const data = await res.json();
        const conversationId = data.data.conversation_id;
        // console.log(conversationId)
  
        if (conversationId) {
          localStorage.setItem('conversation_id', conversationId);
        }
  
        setChatReady(true); // ✅ Only now show chatbot
      } catch (err) {
        console.error('Error initializing chat:', err);
      } finally {
        setIsLoading(false); // stop loading in any case
      }
    };
  
    initChat();
  }, [assetList]);
  

  return (
    <div className='h-screen w-full flex justify-center items-center bg-gray-100'>
      <AnimatePresence mode="wait">
        {chatReady ? (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
          >
            <Chatbot assetList={assetList} />
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: isLoading ? 1.1 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#2f965f] rounded-2xl shadow-xl p-8 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-40 w-80">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <LocationSelector onLocationSelect={handleLocationSelect} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
