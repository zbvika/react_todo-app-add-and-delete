import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import classNames from 'classnames';

interface Props {
  todos: Todo[] | null;
  deleteTodo: (todoId: number) => void;
  isTempTodo: Todo | null;
  isTodoDeleted: number | null;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isTempTodo,
  isTodoDeleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={todo.completed ? 'todo completed' : 'todo'}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active': isTodoDeleted === todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {isTempTodo && <TodoItem isTempTodo={isTempTodo} />}
    </section>
  );
};
