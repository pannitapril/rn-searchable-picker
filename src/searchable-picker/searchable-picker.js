import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import {
  COLOR_BACKGROUND, COLOR_ACCENT, COLOR_TEXTINPUT_ENABLED, COLOR_TEXTINPUT_DISABLED,
} from '../../constant';
import LocalizedString from '../../localization';
import { ios } from '../../helper';
import ButtonText from '../button-text';
import SearchBar from './search-bar-picker';
import TextField from '../text-field';
import Dialog from '../dialog';
import { BodyTitle } from '../labels';

const styles = {
  innerModal: {
    backgroundColor: COLOR_BACKGROUND,
    alignItems: 'center',
    width: '100%',
    height: '50%',
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  searchBarContainer: {
    alignSelf: 'stretch',
    alignItem: 'stretch',
    marginBottom: 18,
  },
  options: {
    padding: 15,
    justifyContent: 'space-between',
    borderBottomColor: COLOR_ACCENT,
    borderBottomWidth: 0.5,
    alignItem: 'center',
  },
  optionText: {
    fontWeight: 'normal',
    color: COLOR_TEXTINPUT_ENABLED,
    textAlign: 'left',
  },
  emptyOption: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  newOptionContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 7,
    justifyContent: 'space-between',
    borderBottomColor: COLOR_ACCENT,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  newOption: {
    borderRadius: 50,
    backgroundColor: COLOR_ACCENT,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  textNewOptionStyle: {
    alignSelf: 'stretch',
    color: COLOR_BACKGROUND,
  },
};

let textTemp = '';

export default class SearchablePicker extends Component {
  textStyle = this.props.itemTextStyle !== {} ? this.props.itemTextStyle : styles.optionText;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      searchbarText: '',
    };
  }

  onPickerButtonPressed = () => {
    this.props.onPickerButtonPress();
    this.setState({
      searchbarText: '',
      showModal: true,
    });
  };

  onChangeSearchBarText = (text) => {
    this.setState({
      searchbarText: text,
    });
    this.props.onTextChanged(text);
    textTemp = text;
  };

  renderNewOption = (text) => {
    if (this.state.searchbarText !== '') {
      return (
        <View style={styles.newOptionContainer}>
          <TouchableOpacity
            onPress={() => { this.onOption(text); }}
            style={[styles.newOption, this.props.newItemContainerStyle]}
          >
            <BodyTitle style={[styles.textNewOptionStyle, this.props.newItemTextStyle]}>
              {text}
            </BodyTitle>
          </TouchableOpacity>
          <Icon
            name={ios ? 'ios-add' : 'md-add'}
            type="ionicon"
            color={COLOR_ACCENT}
            size={25}
            containerStyle={{ alignSelf: 'center' }}
          />
        </View>
      );
    }
    return null;
  }

  filteredOptions = () => {
    const { data } = this.props;

    const sortArray = (a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    };

    const sortedOptions = data.sort(sortArray);
    return sortedOptions;
  };

  onOption = (item) => {
    this.props.onValueSelected(item);
    this.setState({
      showModal: false,
      searchbarText: '',
    });
  };

  renderActivityIndicator = (searching) => {
    if (searching) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="small" color={COLOR_ACCENT} />
        </View>
      );
    }
    return null;
  }

  renderList = item => (
    <View>
      <TouchableOpacity
        onPress={() => { this.onOption(item); }}
        style={[styles.options, this.props.itemContainerStyle]}
      >
        <BodyTitle style={this.textStyle}>{item.label || item}</BodyTitle>
      </TouchableOpacity>
    </View>
  );

  renderCancelButton = () => (
    <ButtonText
      caption={LocalizedString.common.buttonCaptionCancel}
      bold
      onPress={() => { this.setState({ showModal: false }); }}
      style={{ alignSelf: 'center' }}
    />
  );

  renderListEmptyComponent = () => (
    <View style={styles.emptyOption}>
      <BodyTitle>
        {LocalizedString.common.errMsgNoResultFound}
      </BodyTitle>
    </View>
  );

  renderTextField = value => (
    <TouchableOpacity disabled={this.props.disabled} onPress={this.onPickerButtonPressed}>
      <TextField
        label={this.props.label}
        error={this.props.error}
        value={value.label || value}
        disabled
        baseColor={this.props.disabled ? COLOR_TEXTINPUT_DISABLED : COLOR_TEXTINPUT_ENABLED}
        suffixIconName={ios ? 'chevron-down' : 'menu-down'}
      />
    </TouchableOpacity>
  );

  render() {
    return (
      <View>
        <Dialog
          visible={this.state.showModal}
          containerStyle={styles.innerModal}
          onRequestClose={() => {
            this.setState({
              showModal: false,
            });
          }}

        >
          <View style={styles.modalContainer}>
            <SearchBar
              onChangeSearchBarText={this.onChangeSearchBarText}
              searchBarText={this.state.searchbarText}
              style={styles.searchBarContainer}
              clearButtonActive
            />
            {this.renderActivityIndicator(this.props.searching)}
            <View style={styles.modalContainer}>
              <FlatList
                data={textTemp !== '' ? this.filteredOptions() : null}
                keyExtractor={item => item.label || item}
                renderItem={({ item }) => this.renderList(item)}
                ListHeaderComponent={this.props.allowNew
                  ? this.renderNewOption(textTemp) : null}
                ListEmptyComponent={this.renderListEmptyComponent}
              />
            </View>
            {this.renderCancelButton()}
          </View>
        </Dialog>
        {this.renderTextField(this.props.selectedValue)}
      </View>
    );
  }
}

const pickerItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string,
});

const arrayShape = PropTypes.arrayOf(pickerItemShape);

SearchablePicker.propTypes = {
  onPickerButtonPress: PropTypes.func,
  selectedValue: PropTypes.oneOfType([
    pickerItemShape,
    PropTypes.string,
  ]),
  onTextChanged: PropTypes.func.isRequired,
  onValueSelected: PropTypes.func.isRequired,
  allowNew: PropTypes.bool,
  disabled: PropTypes.bool,
  searching: PropTypes.bool,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  data: PropTypes.oneOfType([
    arrayShape,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  itemContainerStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  itemTextStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  newItemContainerStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  newItemTextStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
};

SearchablePicker.defaultProps = {
  onPickerButtonPress: () => {},
  allowNew: false,
  disabled: false,
  searching: false,
  selectedValue: '',
  error: '',
  data: [],
  itemContainerStyle: {},
  itemTextStyle: {},
  newItemContainerStyle: {},
  newItemTextStyle: {},
};
