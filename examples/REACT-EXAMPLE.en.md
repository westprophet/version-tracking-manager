# Example of Using the `version-tracking-manager` Library in a React.js Application

This example demonstrates how to use the `version-tracking-manager` library in a React.js application to track versions and display change logs in a modal window.

## Step 1: Installing the Library

To get started, install the `version-tracking-manager` library using `yarn`:

```bash
yarn add version-tracking-manager
```

## Step 2: Initializing the Library

Create a file named `version-tracking-manager.ts` (or any other suitable name) and initialize the library with the current version of your application, using information from the `package.json` file:

```javascript
// version-tracking-manager.ts

import p from '../package.json';
import VersionTrackingManager from 'version-tracking-manager';

export default new VersionTrackingManager(p.version);
```

## Step 3: Creating the Change Log Dialog Component

Create a React.js component that displays change logs in a modal window and uses the `version-tracking-manager` library to manage the display of logs:

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

## Step 4: Using the Hook to Display Change Logs

Utilize the `useChangeLog` hook to manage the display of change logs in your application:

```javascript
// useChangeLog.js

import useAuth from '../../../hooks/profile/useAuth';
import useProfile from '../../../hooks/profile/useProfile';
import { useCallback, useEffect, useState } from 'react';
import VersionTrackingManager from 'version-tracking-manager';
import changelogFile from '../../../CHANGELOG.md';

export default function useChangeLog() {
  const { isAuth } = useAuth();
  const { data: profile } = useProfile();
  const [isOpenChangeLog, setOpenChangelog] = useState(false);
  const [changelog, setChangeLog] = useState<string>('');

  /**
   * Fetch change logs
   */
  useEffect(() => {
    if (!profile) return;
    fetch(changelogFile)
      .then((res) => res.text())
      .then((text) => setChangeLog(text));
  }, [profile]);

  /**
   * Display the modal
   */
  useEffect(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(p.version);
      const v = versionTrackingManager.canUserSeeVersion(String(profile.Id));
      setTimeout(() => {
        setOpenChangelog(!v);
      }, 2000);
    }
  }, [isAuth, profile, changelog]);

  /**
   * Set a flag that the user has seen this version
   */
  const confirm = useCallback(() => {
    if (isAuth && profile && changelog) {
      const id = String(profile.Id);
      const versionTrackingManager = new VersionTrackingManager(p.version);
      return versionTrackingManager.markVersionAsViewed(id);
    }
  }, [changelog, isAuth, profile]);

  const skip = useCallback(() => {
    if (isAuth && profile && changelog) {
      const versionTrackingManager = new VersionTrackingManager(p.version);
      return versionTrackingManager.skipCheckThisSession();
    }
  }, [changelog, isAuth, profile]);

  return { isOpenChangeLog, setOpenChangelog, changelog, confirm, skip };
}
```

You now have a complete example of using the `version-tracking-manager` library in your React.js application. You can use this example to track versions and display change logs in a modal window.
