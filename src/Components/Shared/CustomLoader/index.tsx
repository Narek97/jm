import './style.scss';

const CustomLoader = () => {
  return (
    <div className={'custom-loader'} data-testid={'custom-loader-test-id'}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default CustomLoader;
