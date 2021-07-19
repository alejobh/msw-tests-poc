/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import FormInput from 'components/FormInput';
import { useRequest, useLazyRequest } from 'hooks/useRequest';
import { getCharacter, getCharacters } from 'services/CharacterService';
import { deletePost, createPost, editPost } from 'services/PostService';

import logo from './assets/logo.svg';
import styles from './styles.module.scss';

interface Form {
  characterId: string;
}

function Home() {
  const { t } = useTranslation();
  const [searchedCharacter, setSearchedCharacter] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const { register, handleSubmit, getValues } = useForm<Form>();

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

  const [, , , deletePostRequest] = useLazyRequest({
    request: deletePost,
    withPostSuccess: () => setNotificationMessage(t('Home:deleteSuccess')),
    withPostFailure: (error) =>
      setNotificationMessage(
        error && error.problem === 'NETWORK_ERROR' ? t('Home:deleteError') : t('Home:invalidID')
      )
  });

  const [, , , createPostRequest] = useLazyRequest({
    request: createPost,
    withPostSuccess: ({ id, userId }) => {
      setNotificationMessage(
        userId ? t('Home:createSuccess', { id, userId }) : t('Home:createConditionalSuccess', { id })
      );
    },
    withPostFailure: () => setNotificationMessage(t('Home:createError'))
  });

  const [, , , editPostRequest] = useLazyRequest({
    request: editPost,
    withPostSuccess: () => setNotificationMessage(t('Home:editSuccess')),
    withPostFailure: (error) =>
      setNotificationMessage(
        error && error.problem === 'NETWORK_ERROR' ? t('Home:editError') : t('Home:invalidID')
      )
  });

  const onSubmit = handleSubmit(({ characterId }) => {
    submitForm(characterId);
  });

  const onDelete = () => {
    const id = getValues('characterId');
    if (id) {
      deletePostRequest(id);
    }
  };

  const onCreate = () => {
    const id = getValues('characterId');
    if (id) {
      const value = searchedCharacter || 'Default';
      createPostRequest({ userId: parseInt(id), title: value, body: value });
    }
  };

  const onEdit = () => {
    const id = getValues('characterId');
    if (id) {
      const value = searchedCharacter || 'Default';
      editPostRequest({
        id: parseInt(id),
        userId: parseInt(id),
        title: value,
        body: value
      });
    }
  };

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
          <button type="submit" aria-label="button" className="m-bottom-5">
            {t('Home:submit')}
          </button>
          <button type="button" aria-label="create" onClick={onCreate} className="m-bottom-5">
            {t('Home:create')}
          </button>
          <button type="button" aria-label="delete" onClick={onDelete} className="m-bottom-5">
            {t('Home:delete')}
          </button>
          <button type="button" aria-label="edit" onClick={onEdit}>
            {t('Home:edit')}
          </button>
        </form>
        <p className="m-bottom-5">
          {characters && !errorMessage
            ? `${t('Home:total')} ${characters.count}`
            : loadingData
            ? t('Home:wait')
            : t('Home:countError')}
        </p>
        <p>{notificationMessage}</p>
      </header>
    </div>
  );
}

export default Home;
