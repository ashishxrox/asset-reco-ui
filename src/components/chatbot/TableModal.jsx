import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const TableModal = ({ isOpen, onClose, tableHtml }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative z-10 bg-white rounded-2xl max-w-4xl w-full mx-auto p-6 shadow-xl">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              Table Preview
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
            </button>
          </div>
          
          <div
            className="overflow-auto max-h-[70vh] custom-scroll"
            dangerouslySetInnerHTML={{ __html: tableHtml }}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default TableModal;
