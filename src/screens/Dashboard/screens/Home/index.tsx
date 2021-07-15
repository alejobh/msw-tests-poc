/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import FormInput from 'components/FormInput';
import { useRequest, useLazyRequest } from 'hooks/useRequest';
import { getCharacter, getCharacters } from 'services/TestService';

import logo from './assets/logo.svg';
import styles from './styles.module.scss';

interface Form {
  characterId: string;
}

function Home() {
  const { t } = useTranslation();
  const [searchedCharacter, setSearchedCharacter] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const [characters, loadingData] = useRequest(
    { request: getCharacters, payload: null, withPostFailure: () => setErrorMessage(true) },
    [searchedCharacter]
  );

  const [characterData, , , submitForm] = useLazyRequest({
    request: getCharacter,
    withPostSuccess: (data) => {
      setSearchedCharacter(data.name);
    },
    withPostFailure: (error) => {
      setSearchedCharacter(
        error && error.problem === 'NETWORK_ERROR' ? t('Home:connectionError') : t('Home:error')
      );
    }
  });

  const { register, handleSubmit } = useForm<Form>();

  const onSubmit = handleSubmit(({ characterId }) => {
    submitForm(characterId);
  });

  useEffect(() => {
    if (characterData) {
      setSearchedCharacter(characterData.name);
    }
  }, [characterData]);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <img src={logo} className={styles.appLogo} alt="logo" />
        <p className={styles.text}>{searchedCharacter || t('Home:character')}</p>
        <form className="column center m-bottom-10" onSubmit={onSubmit}>
          <FormInput
            className="m-bottom-2"
            placeholder={t('Home:character')}
            inputRef={register()}
            name="characterId"
            inputType="text"
          />
          <button type="submit" aria-label="button">
            {t('Home:submit')}
          </button>
        </form>
        <p>
          {characters && !errorMessage
            ? `${t('Home:total')} ${characters.count}`
            : loadingData
            ? t('Home:wait')
            : t('Home:countError')}
        </p>
      </header>
    </div>
  );
}

export default Home;
