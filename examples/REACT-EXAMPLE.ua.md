# Приклад використання бібліотеки `version-tracking-manager` в React.js

Цей приклад показує, як використовувати бібліотеку `version-tracking-manager` в додатку React.js для відстеження версій і відображення журналу змін у модальному вікні.

## Крок 1: Встановлення бібліотеки

Спершу встановіть бібліотеку `version-tracking-manager` за допомогою `yarn`:

```bash
yarn add version-tracking-manager
```

## Крок 2: Ініціалізація бібліотеки

Створіть файл `src/version-tracking-manager.ts` (або інше зручне ім'я) та ініціалізуйте бібліотеку поточною версією вашого додатка, використовуючи інформацію з файлу `package.json`:

```javascript
// src/version-tracking-manager.ts

import p from './package.json';
import VersionTrackingManager from 'version-tracking-manager';

export default new VersionTrackingManager(p.version);
```

## Крок 3: Створення компонента діалогу журналу змін

Створіть компонент React.js, який відображає журнал змін у модальному вікні та використовує бібліотеку `version-tracking-manager` для керування відображенням журналу змін:

```javascript
// ChangeLogDialog.js

import React, { useCallback } from 'react';
import s from './ChangeLogDialog.module.scss';
import cn from 'classnames';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useGetUserRoleGroup, useGetUserRoleType } from '../../hooks/profile/useGetUserRole';
import useChangeLog from './hooks/useChangeLog';
import VersionTrackingManager from 'src/version-tracking-manager.ts';

export default function ChangeLogDialog({ className }: IChangeLogDialogProps) {
  const profileRole = useGetUserRoleType();
  const profileRoleGroup = useGetUserRoleGroup();
  const { isOpenChangeLog, setOpenChangelog, changelog, confirm, skip } = useChangeLog();

  const [scroll] = React.useState('paper');

  const onCloseHandle = useCallback(() => {
    skip();
    setOpenChangelog(false);
  }, [setOpenChangelog, skip]);

  const onAgreeHandle = useCallback(() => {
    confirm();
    setOpenChangelog(false);
  }, [confirm, setOpenChangelog]);

  const Li = ({ roles, rolesGroup, children }: any) => {
    if (!roles && !rolesGroup) return <li>{children};
    if (!profileRole || !profileRoleGroup) return null;

    const isRoleShow = String(roles).split(', ').includes(profileRole);
    const isRoleGroupShow = String(rolesGroup)
      .split(', ')
      .includes(profileRoleGroup);

    return isRoleGroupShow || isRoleShow ? <li>{children}</li> : null;
  };

  return (
    <Dialog
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
        <Button onClick={onCloseHandle}>Пізніше</Button>
        <Button onClick={onAgreeHandle}>Погоджуюсь</Button>
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

## Крок 4: Використання хука для відображення журналу змін

Використовуйте хук `useChangeLog` для керування відображенням журналу змін у вашому додатку:

```javascript
// useChangeLog.js

import useAuth from '../../../hooks/profile/useAuth';
import useProfile from '../../../hooks/profile/useProfile';
import { useCallback, useEffect, useState } from 'react';
import changelogFile from '../../../CHANGELOG.md';
import VersionTrackingManager from 'src/version-tracking-manager.ts';

export default function useChangeLog() {
  const { isAuth } = useAuth();
  const { data: profile } = useProfile();
  const [isOpenChangeLog, setOpenChangelog] = useState(false);
  const [changelog, setChangeLog] = useState<string>('');

  /**
   * Отримуємо журнал змін
   */
  useEffect(() => {
    if (!profile) return;
    fetch(changelogFile)
      .then((res) => res.text())
      .then((text) => setChangeLog(text));
  }, [profile]);

  /**
   * Відображаємо модальне вікно


   */
  useEffect(() => {
    if (isAuth && profile && changelog) {
      const v = VersionTrackingManager.canUserSeeVersion(String(profile.Id));
      setTimeout(() => {
        setOpenChangelog(!v);
      }, 2000);
    }
  }, [isAuth, profile, changelog]);

  /**
   * Встановлюємо прапорець, що користувач бачив цю версію
   */
  const confirm = useCallback(() => {
    if (isAuth && profile && changelog) {
      const id = String(profile.Id);
      return VersionTrackingManager.markVersionAsViewed(id);
    }
  }, [changelog, isAuth, profile]);

  const skip = useCallback(() => {
    if (isAuth && profile && changelog) {
      return VersionTrackingManager.skipCheckThisSession();
    }
  }, [changelog, isAuth, profile]);

  return { isOpenChangeLog, setOpenChangelog, changelog, confirm, skip };
}
```
