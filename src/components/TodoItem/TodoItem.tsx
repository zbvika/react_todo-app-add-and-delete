/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  isTempTodo: Todo | null;
}

export const TodoItem: React.FC<Props> = ({ isTempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {isTempTodo?.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isTempTodo })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
