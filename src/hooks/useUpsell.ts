import { useState } from 'react';

export interface UpsellOffer {
    fromProductId: string;
    toProductId: string;
    upsellPrice: string;
    totalPrice: string;
    upsellFeatures: string[];
}

export const useUpsell = () => {
    const [isUpsellOpen, setIsUpsellOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<UpsellOffer | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    const showUpsell = (offer: UpsellOffer) => {
        setCurrentOffer(offer);
        setIsUpsellOpen(true);
    };

    const acceptUpsell = () => {
        if (currentOffer) {
            setSelectedProductId(currentOffer.toProductId);
            setIsUpsellOpen(false);
            return currentOffer.toProductId;
        }
        return null;
    };

    const declineUpsell = () => {
        if (currentOffer) {
            setSelectedProductId(currentOffer.fromProductId);
            setIsUpsellOpen(false);
            return currentOffer.fromProductId;
        }
        return null;
    };

    const closeUpsell = () => {
        setIsUpsellOpen(false);
    };

    return {
        isUpsellOpen,
        currentOffer,
        selectedProductId,
        showUpsell,
        acceptUpsell,
        declineUpsell,
        closeUpsell,
    };
};
