import React from 'react';
import { connect } from 'react-redux';
import { addressUISchema } from '../../schemas/address-schema';
import ReviewCardField from '../addressFields/ReviewCardField';

// TODO: Safety checks for `selected` callback and `label` element

export class AddressArrayWidget extends React.Component {
  render() {
    return ['permanentAddress', 'temporaryAddress'].map((address, index) => {
      const uiSchema = addressUISchema(true, '', () => true);

      return (
        <ReviewCardField
          key={index}
          formData={this.props[address]}
          uiSchema={uiSchema}
          {...this.props}
        />
      );
    });
  }

  // AddressArrayWidget.propTypes = {
  //   supplies: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       deviceName: PropTypes.string,
  //       productName: PropTypes.string,
  //       productGroup: PropTypes.string.isRequired,
  //       productId: PropTypes.string.isRequired,
  //       availableForReorder: PropTypes.bool,
  //       lastOrderDate: PropTypes.string.isRequired,
  //       nextAvailabilityDate: PropTypes.string.isRequired,
  //       quantity: PropTypes.number.isRequired,
  //       size: PropTypes.string,
  //     }),
  //   ),
  // };
}

const mapStateToProps = state => ({
  permanentAddress: state.form?.data?.permanentAddress,
  temporaryAddress: state.form?.data?.temporaryAddress,
  uiSchema: state.form?.pages?.address?.uiSchema?.address,
});

export default connect(
  mapStateToProps,
  null,
)(AddressArrayWidget);
