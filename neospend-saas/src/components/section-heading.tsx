import { cn } from '@/lib/utils';

export const SectionHeading = ({
                                   children,
                                   className,
                               }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h2 className={cn('text-3xl font-bold tracking-tight text-center mb-4', className)}>
            {children}
        </h2>
    );
};