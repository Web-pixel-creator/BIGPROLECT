import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '~/components/ui/Select';
import { MODEL_LIST, PROVIDER_LIST } from '~/utils/constants';

interface CustomModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

export const CustomModelSelector: FC<CustomModelSelectorProps> = ({ selectedModel, onModelChange, className }) => {
  // Group models by provider
  const modelsByProvider = MODEL_LIST.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }

      acc[model.provider].push(model);

      return acc;
    },
    {} as Record<string, typeof MODEL_LIST>,
  );

  const getProviderName = (providerId: string) => {
    return PROVIDER_LIST.find((p) => p.name === providerId)?.name || providerId;
  };

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className={`w-[180px] h-8 text-xs ${className}`}>
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(modelsByProvider).map(([provider, models]) => (
          <SelectGroup key={provider}>
            <SelectLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
              {getProviderName(provider)}
            </SelectLabel>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name} className="text-xs pl-4 cursor-pointer">
                {model.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
