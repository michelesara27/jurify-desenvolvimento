import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  mode?: "single" | "range";
  selected?: Date | DateRange;
  onSelect?: (date: Date | DateRange | undefined) => void;
}

export function DatePicker({
  className,
  placeholder = "Selecione uma data",
  mode = "single",
  selected,
  onSelect,
}: DatePickerProps) {
  const isSingleMode = mode === "single";
  
  const formatSelectedDate = () => {
    if (!selected) return "";
    
    if (isSingleMode) {
      return format(selected as Date, "PPP", { locale: ptBR });
    }
    
    const range = selected as DateRange;
    if (range.from) {
      if (!range.to) {
        return format(range.from, "PPP", { locale: ptBR });
      }
      return `${format(range.from, "PPP", { locale: ptBR })} - ${format(range.to, "PPP", { locale: ptBR })}`;
    }
    return "";
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? formatSelectedDate() : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode={mode}
            selected={selected}
            onSelect={onSelect}
            locale={ptBR}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}