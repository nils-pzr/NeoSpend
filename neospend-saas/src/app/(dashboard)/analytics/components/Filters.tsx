'use client';

import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FiltersState = {
    from: string; // yyyy-mm-dd
    to: string;   // yyyy-mm-dd
};

export default function Filters({
                                    value,
                                    onChange,
                                }: {
    value: FiltersState;
    onChange: Dispatch<SetStateAction<FiltersState>>;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
                <Label htmlFor="from">From</Label>
                <Input
                    id="from"
                    type="date"
                    value={value.from}
                    onChange={(e) => onChange((p) => ({ ...p, from: e.target.value }))}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="to">To</Label>
                <Input
                    id="to"
                    type="date"
                    value={value.to}
                    onChange={(e) => onChange((p) => ({ ...p, to: e.target.value }))}
                />
            </div>
        </div>
    );
}
