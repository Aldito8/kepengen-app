'use client';

import ProgressBar from "@ramonak/react-progress-bar";

interface ProgressBarClientProps {
    collected: number;
    tariff: number;
}

export default function ProgressBarClient({ collected, tariff }: ProgressBarClientProps) {
    const percentage = (collected / tariff) * 100;
    const label = `${(percentage >= 100 ? 100 : percentage).toFixed(2)}%`;

    return (
        <ProgressBar
            completed={percentage}
            bgColor="#4caf50"
            baseBgColor="#e0e0e0"
            height="5px"
            labelAlignment="outside"
            customLabel={label}
            labelColor="black"
        />
    );
}