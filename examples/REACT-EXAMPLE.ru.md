# Пример использования библиотеки `version-tracking-manager` в React.js

Этот пример покажет, как использовать библиотеку `version-tracking-manager` в приложении React.js для отслеживания версий и отображения логов изменений в модальном окне.

## Шаг 1: Установка библиотеки

Для начала установите библиотеку `version-tracking-manager` через `yarn`:

```bash
yarn add version-tracking-manager
```

## Шаг 2: Инициализация библиотеки

Создайте файл `version-tracking-manager.ts` (или любое другое удобное имя) и проинициализируйте библиотеку с текущей версией вашего приложения, используя информацию из файла `package.json`:

```javascript
// version-tracking-manager.ts

import p from './package.json';
import VersionTrackingManager from 'version-tracking-manager';

export default new VersionTrackingManager(p.version);
```

## Шаг 3: Создание компонента модального окна логов изменений

Создайте компонент React.js, который будет отображать логи изменений в модальном окне и использовать библиотеку `version-tracking-manager` для управления отображением логов.

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
import VersionTrackingManager from 'version-tracking-manager';

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
      <DialogTitle>What's New?</DialogTitle>
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
        <Button onClick={onCloseHandle}>Later</Button>
        <Button onClick={onAgreeHandle}>I Agree</Button>
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

## Шаг 4: Использование хука для отображения логов изменений

Используйте хук `useChangeLog` для управления отображением логов изменений в вашем приложении:

```javascript
// useChangeLog.js

import useAuth from '../../../hooks/profile/useAuth';
import useProfile from '../../../hooks/profile/useProfile';
import { useCallback, useEffect, useState } from 'react';
import VersionTrackingManager from 'version-tracking-manager'; // Обновленный импорт библиотеки
import changelogFile from '../../../CHANGELOG.md';

export default function useChangeLog() {
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
  }, [profile]);

  /**
   * Показываем модалку
   */
  useEffect(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(p.version); // Обновленная инициализация
      const v = versionTrackingManager.canUserSeeVersion(String(profile.Id));
      setTimeout(() => {
        setOpenChangelog(!v);
      }, 2000);
    }
  }, [isAuth, profile, changelog]);

  /**
   * Устанавливаем флаг что юзер видел эту версию
   */
  const confirm = useCallback(() => {
    if (isAuth && profile && changelog) {
      const id = String(profile.Id);
      const versionTrackingManager = new VersionTrackingManager(p.version); // Обновленная инициализация
      return versionTrackingManager.markVersionAsViewed(id);
    }
  }, [changelog, isAuth, profile]);

  const skip = useCallback(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(p.version); // Обновленная инициализация
      return versionTrackingManager.skipCheckThisSession();
    }
  }, [changelog, isAuth, profile]);

  return { isOpenChangeLog

, setOpenChangelog, changelog, confirm, skip };
}
```

Теперь у вас есть полный пример использования библиотеки `version-tracking-manager` в вашем приложении React.js. Вы можете использовать этот пример для отслеживания версий и отображения логов изменений в модальном окне.
