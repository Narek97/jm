import { Line } from 'rc-progress';

const ProgressBar = ({ generationProgress }: { generationProgress: number }) => {
  return (
    <div className="absolute bg-(--very-light-gray)/70 top-0 left-0 w-full h-full z-20 text-center flex flex-col items-center justify-center">
      <div className="w-full">
        <h3 className="mb-4 text-xl !font-semibold">Processing</h3>
        <p className="text-sm">Please wait while we generate your AI persona.</p>
        <Line
          className="mx-3 w-[60%]"
          percent={generationProgress}
          strokeWidth={2}
          strokeColor="var(--primary)"
        />
        <p className="text-sm">{generationProgress}%</p>
      </div>
    </div>
  );
};

export default ProgressBar;
