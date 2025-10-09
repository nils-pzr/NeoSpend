'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type FiltersState = {
    from: string; // yyyy-mm-dd
    to: string;   // yyyy-mm-dd
};

// lokales YYYY-MM-DD (kein UTC-Shift)
function toYMDLocal(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function DatePickerField({
                             id,
                             label,
                             value,
                             onChange,
                         }: {
    id: string;
    label: string;
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    // lokal parsen (nicht UTC)
    const date = value ? new Date(value + 'T00:00:00') : undefined;

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={id}>{label}</Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        className={cn(
                            'h-11 w-full justify-start text-left text-[15px] font-medium',
                            'bg-background border border-border hover:bg-accent/40',
                            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-xl'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        {date ? (
                            format(date, 'dd.MM.yyyy', { locale: de })
                        ) : (
                            <span className="text-muted-foreground">tt.mm.jjjj</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className={cn('w-[320px] p-3 rounded-2xl border border-border bg-background shadow-xl')}
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            if (!d) return;
                            onChange(toYMDLocal(d));
                            setOpen(false);
                        }}
                        locale={de}
                        initialFocus
                        classNames={{
                            months: 'space-y-3',
                            month: 'space-y-3',
                            caption: 'flex items-center justify-between px-2 pt-1 text-base font-semibold',
                            caption_label: 'text-base font-semibold',
                            nav: 'flex items-center gap-1',
                            nav_button: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground'
                            ),
                            table: 'w-full border-collapse',
                            head_row: 'grid grid-cols-7 gap-1 px-1',
                            head_cell: 'text-[11px] font-medium uppercase tracking-wide text-muted-foreground text-center',
                            row: 'grid grid-cols-7 gap-1 px-1',
                            cell: 'p-0',
                            day: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'h-9 w-9 p-0 rounded-lg font-medium text-[13px] transition-colors',
                                'hover:bg-primary/10 hover:text-foreground'
                            ),
                            day_selected: 'bg-primary text-primary-foreground hover:bg-primary rounded-lg',
                            day_today: 'ring-1 ring-primary/40 ring-offset-0 rounded-lg',
                            day_outside: 'text-muted-foreground/50 opacity-60',
                            day_disabled: 'text-muted-foreground/40 opacity-40',
                            caption_dropdowns: 'flex gap-2',
                        }}
                    />

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 px-1">
                        <Button variant="ghost" className="h-8 px-3 text-sm" onClick={() => onChange('')}>
                            Löschen
                        </Button>
                        <Button
                            variant="secondary"
                            className="h-8 px-3 text-sm"
                            onClick={() => onChange(toYMDLocal(new Date()))}
                        >
                            Heute
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default function Filters({
                                    value,
                                    onChange,
                                }: {
    value: FiltersState;
    onChange: Dispatch<SetStateAction<FiltersState>>;
}) {
    // Load saved
    useEffect(() => {
        const savedFrom = localStorage.getItem('analytics_from');
        const savedTo = localStorage.getItem('analytics_to');
        if (savedFrom || savedTo) {
            onChange((p) => ({
                ...p,
                from: savedFrom ?? '',
                to: savedTo ?? '',
            }));
        }
    }, [onChange]);

    // Save
    useEffect(() => {
        if (value.from) localStorage.setItem('analytics_from', value.from);
        if (value.to) localStorage.setItem('analytics_to', value.to);
    }, [value.from, value.to]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DatePickerField
                id="from"
                label="From"
                value={value.from}
                onChange={(val) => onChange((p) => ({ ...p, from: val }))}
            />
            <DatePickerField
                id="to"
                label="To"
                value={value.to}
                onChange={(val) => onChange((p) => ({ ...p, to: val }))}
            />
        </div>
    );
}
