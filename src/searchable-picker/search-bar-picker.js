import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LocalizedString from '../../localization';
import { COLOR_PRIMARY, COLOR_BACKGROUND_DARK, COLOR_ACCENT } from '../../constant';
import { ios } from '../../helper';

const styles = {
  searchBarContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  searchBar: {
    height: 48,
    backgroundColor: COLOR_BACKGROUND_DARK,
    color: COLOR_ACCENT,
    paddingLeft: 20,
  },
  clearButtonStyle: {
    height: 48,
    backgroundColor: COLOR_BACKGROUND_DARK,
    justifyContent: 'center',
    paddingRight: 6,
  },
};

export default class SearchBar extends Component {
  renderClearButton = (status, onChange, text) => {
    if (!ios && status && text !== '') {
      return (
        <TouchableOpacity style={styles.clearButtonStyle} onPress={() => onChange('')}>
          <Icon
            name="clear"
            size={20}
            color={COLOR_PRIMARY}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const {
      searchBarText, onChangeSearchBarText, style, clearButtonActive, onBlur, onFocus,
    } = this.props;
    const searchbarWidth = !ios && clearButtonActive && searchBarText !== '' ? { width: '92.7%' } : { width: '100%' };
    return (
      <View style={[styles.searchBarContainer, style]}>
        <TextInput
          autoFocus
          style={[styles.searchBar, searchbarWidth]}
          underlineColorAndroid="transparent"
          placeholder={LocalizedString.common.placeholderSearch}
          placeholderTextColor={COLOR_ACCENT}
          autoCapitalize="sentences"
          value={searchBarText}
          onChangeText={text => onChangeSearchBarText(text)}
          onFocus={onFocus}
          onBlur={onBlur}
          clearButtonMode="while-editing"
        />
        {this.renderClearButton(clearButtonActive, onChangeSearchBarText, searchBarText)}
      </View>
    );
  }
}

SearchBar.propTypes = {
  searchBarText: PropTypes.string.isRequired,
  onChangeSearchBarText: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  clearButtonActive: PropTypes.bool,
};

SearchBar.defaultProps = {
  style: {},
  clearButtonActive: false,
  onFocus: () => {},
  onBlur: () => {},
};
