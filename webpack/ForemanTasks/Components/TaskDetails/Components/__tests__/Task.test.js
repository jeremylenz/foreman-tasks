import React from 'react';
import {
  testComponentSnapshotsWithFixtures,
  mount,
  shallow,
} from '@theforeman/test';
import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';
import Task from '../Task';
import {
  UNLOCK_MODAL,
  FORCE_UNLOCK_MODAL,
} from '../../../TaskActions/TaskActionsConstants';

const fixtures = {
  'render without Props': { id: 'test' },
  'render with some Props': {
    id: 'test',
    state: 'paused',
    hasSubTasks: true,
    allowDangerousActions: true,
    dynflowEnableConsole: true,
    parentTask: 'parent-id',
    taskReload: true,
  },
};

describe('Task', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Task, fixtures));
  describe('click test', () => {
    const setModalOpen = jest.fn();
    useForemanModal.mockImplementation(id => ({
      setModalOpen: () => setModalOpen(id),
    }));
    const cancelTaskRequest = jest.fn();
    const resumeTaskRequest = jest.fn();
    const taskReloadStart = jest.fn();
    const id = 'some-id';
    const action = 'some-action';
    const props = {
      taskReload: false,
      taskReloadStart,
      id,
      action,
      cancelTaskRequest,
      resumeTaskRequest,
      allowDangerousActions: true,
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('reload', () => {
      const component = mount(<Task {...props} />);
      const reloadButton = component.find('.reload-button').at(0);
      reloadButton.simulate('click');
      expect(taskReloadStart).toBeCalled();
    });
    it('resume', () => {
      const component = shallow(<Task {...props} />);
      const resumeButton = component.find('.resume-button').at(0);
      resumeButton.props().onClick();
      expect(taskReloadStart).toBeCalled();
      expect(resumeTaskRequest).toBeCalledWith(id, action);
    });
    it('cancel', () => {
      const component = shallow(<Task {...props} />);
      const cancelButton = component.find('.cancel-button').at(0);
      cancelButton.props().onClick();
      expect(taskReloadStart).toBeCalled();
      expect(cancelTaskRequest).toBeCalledWith(id, action);
    });
    it('unlock', () => {
      const component = shallow(<Task {...props} />);
      const unlockButton = component.find('.unlock-button').at(0);
      unlockButton.props().onClick();
      expect(setModalOpen).toBeCalledWith({ id: UNLOCK_MODAL });
    });
    it('focrce unlock', () => {
      const component = shallow(<Task {...props} />);
      const forceUnlockButton = component.find('.force-unlock-button').at(0);
      forceUnlockButton.props().onClick();
      expect(setModalOpen).toBeCalledWith({ id: FORCE_UNLOCK_MODAL });
    });
  });
});
