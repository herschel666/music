import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import Page from '../../Page';

import i18n, { getAppLanguage, getLanguages, setAppLanguage } from '../../../services/i18n';
import { getUrl } from '../../../services/navigation';


class PageSettings extends React.Component {
    componentDidUpdate(lastProps) {
        const { isLoggedIn, history } = this.props;
        if (lastProps.isLoggedIn !== isLoggedIn) {
            history.push(getUrl('index'));
        }
    }

    @autobind
    handleSubmitFormAuth(e) {
        e.preventDefault();
        const { isLoggedIn, login, logout } = this.props;
        if (isLoggedIn) {
            logout();
        } else {
            login({
                password: this.password.value
            }, 60 * 60 * 24 * 30);
        }
    }

    @autobind
    handleSubmitFormQuit(e) {
        e.preventDefault();
        window.history.back();
    }

    @autobind
    handleChange(e) {
        setAppLanguage(e.target.value);
        window.location.reload();
    }

    render() {
        const { isLoggedIn } = this.props;
        return (
            <Page id="settings">
                <h2>{i18n('page_settings_headline')}</h2>
                <form
                    onSubmit={this.handleSubmitFormQuit}
                >
                    <button type="submit">
                        {i18n(`page_settings_button_quit`)}
                    </button>
                </form>
                <h2>{i18n('page_settings_lang_headline')}</h2>
                <form>
                    <select
                        defaultValue={getAppLanguage()}
                        onChange={this.handleChange}
                    >
                        {getLanguages().map((language) => (
                            <option
                                key={language}
                                value={language}
                            >
                                {i18n(`lang_${language}`)}
                            </option>
                        ))}
                    </select>
                </form>
                <h2>{i18n('page_settings_auth_headline')}</h2>
                <form
                    onSubmit={this.handleSubmitFormAuth}
                >
                    {isLoggedIn ? null : (
                        <input
                            type="password"
                            ref={(ref) => {
                                this.password = ref;
                            }}
                        />
                    )}
                    <button type="submit">
                        {i18n(`page_settings_auth_button_${isLoggedIn ? 'logout' : 'login'}`)}
                    </button>
                </form>
            </Page>
        );
    }
}

PageSettings.propTypes = {
    history: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default PageSettings;
