import { FC, useCallback } from 'react';

import './style.scss';
import PersonaImages from '@/Features/PersonaImages';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { SelectedPersonasViewModeEnum } from '@/types/enum.ts';

interface ISelectedPersonas {
  viewMode: SelectedPersonasViewModeEnum;
  personas: PersonaType[];
  showActives: boolean;
  showFullItems?: boolean;
  disabled?: boolean;
  updatePersonas?: (id: number) => void;
}

const JourneyMapSelectedPersonas: FC<ISelectedPersonas> = ({
  viewMode,
  personas,
  showActives,
  showFullItems = false,
  disabled,
  updatePersonas,
}) => {
  const handleSelectJourneyMapFooter = useCallback(
    (id: number) => {
      if (updatePersonas) {
        updatePersonas(id);
      }
    },
    [updatePersonas],
  );

  return (
    <>
      <div className="persona-add-images">
        <PersonaImages
          viewMode={viewMode}
          showFullItems={showFullItems}
          handleSelectPersonaItem={showActives && !disabled ? handleSelectJourneyMapFooter : null}
          personas={personas}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default JourneyMapSelectedPersonas;
