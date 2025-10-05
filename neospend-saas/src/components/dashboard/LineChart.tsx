// src/components/dashboard/LineChart.tsx
'use client';
import { LineChart as LC, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LineChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer>
                <LC data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" dot={false} />
                </LC>
            </ResponsiveContainer>
        </div>
    );
}