import { useEffect, useRef, useState } from 'react';

interface Props {
  addTodo: (title: string) => Promise<void>;
  isInputDisabled: boolean;
  errorMessage: string | null;
}

export const Header: React.FC<Props> = ({ addTodo, isInputDisabled }) => {
  const [title, setTitle] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo(title)
            .then(() => setTitle(''))
            .catch(() => {});
        }}
      >
        <input
          ref={focusRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value.trimStart())}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
