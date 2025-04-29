import React, { useState, useEffect } from 'react';
import Chatbot from './components/chatbot/Chatbot';
import LocationSelector from './components/locationSelector/LocationSelector';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [assetList, setAssetList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatReady, setChatReady] = useState(false); // NEW state

  const APIurl = "https://devapi.monetez.com/api/univerze/v1/init-chat" 
  // const APIurl = "http://localhost:8000/api/univerze/v1/init-chat" 

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
    return (assets || []).map(asset => (
      `- Asset Name: ${asset.asset_name} | Asset Rate: ₹${asset.rate} | Asset Details: ${asset.details || 'N/A'} | Asset Location: ${asset.company_name} | Frequency: ${asset.frequency || 'N/A'} | Reach: ${asset.reach || 'N/A'} | Asset Type: ${asset.asset_type_name || 'N/A'} | Quantity: ${asset.quantity || 'N/A'}`
    )).join('\n');
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
