import { connect } from 'react-redux';
import <%= capFeaturePart %>Component from './<%= featurePart %>.component';
import { <%= feature %>Operations } from './duck';

const mapStateToProps = state => {
  const { defaultProp } = state.<%= feature %>Reducer;
  return { defaultProp }
};

const mapDispatchToProps = dispatch => {
  const defaultOperation = () => dispatch(<%= feature %>Operations.defaultOperation()));

  return {
    defaultOperation
  }
};

const <%= capFeaturePart %>Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(<%= capFeaturePart %>Component);

export default <%= capFeaturePart %>Container;
