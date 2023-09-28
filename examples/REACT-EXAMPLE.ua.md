
# Приклад використання бібліотеки Version Tracking Manager у React.js

У цьому прикладі ми покажемо, як використовувати бібліотеку Version Tracking Manager для відстеження версій вашого веб-додатка та відображення повідомлень про зміни користувачам.

## Встановлення

Для використання бібліотеки Version Tracking Manager вам необхідно спершу встановити її за допомогою наступної команди:

```bash
yarn add version-tracking-manager
```

## Створення компонента ChangeLogDialog

Ми створимо компонент `ChangeLogDialog`, який буде відображати журнал змін для користувачів після оновлення версії додатка. Цей компонент використовує бібліотеку Version Tracking Manager для відстеження, які версії користувачі бачили.

```javascript
import React, { useCallback } from 'react';
import s from './ChangeLogDialog.module.scss';
import cn from 'classnames';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import useChangelog from './hooks/useChangeLog';
import { Button } from '@mui/material';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import {
  useGetUserRoleGroup,
  useGetUserRoleType,
} from '../../hooks/profile/useGetUserRole';

export default function ChangeLogDialog({ className }: IChangeLogDialogProps) {
  const profileRole = useGetUserRoleType();
  const profileRoleGroup = useGetUserRoleGroup();

  const { isOpenChangeLog, setOpenChangelog, changelog, confirm, skip } =
    useChangelog();

  const [scroll] = React.useState<DialogProps['scroll']>('paper');

  const onCloseHandle = useCallback(() => {
    skip();
    setOpenChangelog(false);
  }, [setOpenChangelog, skip]);

  const onAgreeHandle = useCallback(() => {
    confirm();
    setOpenChangelog(false);
  }, [confirm, setOpenChangelog]);

  const Li = ({ roles, rolesGroup, children }: any) => {
    if (!roles && !rolesGroup) return <li>{children}</li>;
    if (!profileRole || !profileRoleGroup) return null;

    const isRoleShow = String(roles).split(', ').includes(profileRole);
    const isRoleGroupShow = String(rolesGroup)
      .split(', ')
      .includes(profileRoleGroup);

    return isRoleGroupShow || isRoleShow ? <li>{children}</li> : null;
  };

  return (
    <Dialog
      // fullScreen
      fullWidth
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll={scroll}
      open={isOpenChangeLog}
      onClose={onCloseHandle}
      className={cn(s.ChangeLogDialog, className)}
    >
      <DialogTitle>Що нового?</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText className={cn(s.content)}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              li: Li,
            }}
          >
            {changelog}
          </ReactMarkdown>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandle}>Потім</Button>
        <Button onClick={onAgreeHandle}>Ознайомився</Button>
      </DialogActions>
    </Dialog>
  );
}

ChangeLogDialog.defaultProps = {
  className: '',
};

interface IChangeLogDialogProps {
  className?: string;
}
```

## Використання хука useChangeLog

Тепер давайте розглянемо код хука `useChangeLog`, який використовується в компоненті `ChangeLogDialog`. Цей хук використовує бібліотеку Version Tracking Manager для відстеження версій та відображення журналу змін користувачам.

```javascript
import useAuth from '../../../hooks/profile/useAuth';
import useProfile from '../../../hooks/profile/useProfile';
import { useCallback, useEffect, useState } from 'react';
import VersionTrackingManager from 'version-tracking-manager';

import changelogFile from '../../../CHANGELOG.md';

export default function useChangelog() {
  const { isAuth } = useAuth();


  const { data: profile } = useProfile();
  const [isOpenChangeLog, setOpenChangelog] = useState(false);
  const [changelog, setChangeLog] = useState<string>('');

  /**
   * Подтягиваем лог изменений
   */
  useEffect(() => {
    if (!profile) return;
    fetch(changelogFile)
      .then((res) => res.text())
      .then((text) => setChangeLog(text));
    // import('../../CHANGELOG.md').then((module) => {}); // Динамический импорт
  }, [profile]);

  /**
   * Показываем модалку
   */
  useEffect(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(
        profile.Id, // Передаємо ID користувача як ключ
        'changelog-view-key' // Передаємо ім'я ключа для локального сховища (за бажанням)
      );

      const hasSeenVersion = versionTrackingManager.isShowVersion(profile.Id);

      setTimeout(() => {
        setOpenChangelog(!hasSeenVersion);
      }, 2000);
    }
  }, [isAuth, profile, changelog]);

  /**
   * Устанавливаем флай що користувач бачив цю версію
   */
  const confirm = useCallback(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(
        profile.Id, // Передаємо ID користувача як ключ
        'changelog-view-key' // Передаємо ім'я ключа для локального сховища (за бажанням)
      );

      return versionTrackingManager.setIsShow(profile.Id);
    }
  }, [changelog, isAuth, profile]);

  const skip = useCallback(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(
        profile.Id, // Передаємо ID користувача як ключ
        'changelog-view-key' // Передаємо ім'я ключа для локального сховища (за бажанням)
      );

      return versionTrackingManager.skipCheckThisSession();
    }
  }, [changelog, isAuth, profile]);

  return { isOpenChangeLog, setOpenChangelog, changelog, confirm, skip };
}
```

## Ініціалізація Version Tracking Manager

Бібліотека Version Tracking Manager ініціалізується з ключем (зазвичай ідентифікатором користувача) та ім'ям ключа для локального сховища. Ось приклад ініціалізації:

```javascript
const versionTrackingManager = new VersionTrackingManager(
  userId, // Передаємо ідентифікатор користувача
  'changelog-view-key' // Передаємо ім'я ключа для локального сховища (за бажанням)
);
```

Цей приклад допоможе вам відстежувати версії вашого додатка та відображати зміни користувачам на основі їх взаємодії з різними версіями додатка.

Це все! Тепер у вас є приклад використання бібліотеки Version Tracking Manager у вашому додатку React.js. Насолоджуйтеся відстеженням версій та сповіщеннями про зміни для вашого додатка!

