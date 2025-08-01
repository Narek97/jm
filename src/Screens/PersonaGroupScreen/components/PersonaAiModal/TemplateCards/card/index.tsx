import { WuCheckbox } from '@npm-questionpro/wick-ui-lib';

interface CardProps {
  id: string;
  title: string;
  description: string;
  isChecked: boolean;
  onToggle: () => void;
}

const Card = ({ id, title, description, isChecked, onToggle }: CardProps) => (
  <div
    className="flex items-start bg-[var(--light-gray)] !p-2 gap-1"
    data-testid={`card-${id.replace(/\s+/g, '-').toLowerCase()}`}>
    <WuCheckbox checked={isChecked} onChange={onToggle} />
    <div onClick={onToggle}>
      <h5 className="text-sm leading-4 !mb-1">{title}</h5>
      <p className="text-[0.65rem] leading-3.5">{description}</p>
    </div>
  </div>
);

export default Card;
