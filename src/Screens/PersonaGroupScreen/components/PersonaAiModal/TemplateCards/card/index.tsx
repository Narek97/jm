import './style.scss';
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
    className="template-cards-container--card"
    data-testid={`card-${id.replace(/\s+/g, '-').toLowerCase()}`}>
    <WuCheckbox checked={isChecked} onChange={onToggle} />
    <div className="template-cards-container--card--content" onClick={onToggle}>
      <h5>{title}</h5>
      <p>{description}</p>
    </div>
  </div>
);

export default Card;
