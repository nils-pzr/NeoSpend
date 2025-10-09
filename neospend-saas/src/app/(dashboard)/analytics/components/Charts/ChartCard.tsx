import { PropsWithChildren } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
    title: string;
    subtitle?: string;
    className?: string;
    actions?: React.ReactNode;
}>;

export default function ChartCard({ title, subtitle, className, actions, children }: Props) {
    return (
        <Card className={cn('h-full', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    {subtitle ? (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    ) : null}
                </div>
                {actions}
            </CardHeader>
            <CardContent className="pt-4">
                <div className="w-full h-[320px]">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}
