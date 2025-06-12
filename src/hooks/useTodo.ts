import { useEffect, useState } from 'react';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

export function useTodo() {
  const [data, setData] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTempTodo, setIsTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isTodoDeleted, setIsTodoDeleted] = useState<number | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage(null);
    todoService
      .getTodos()
      .then(setData)
      .catch(() => showError('Unable to load todos'));
  }, []);

  const deleteTodo = (todoId: number) => {
    setIsTodoDeleted(todoId);
    todoService
      .deleteTodos(todoId)
      .then(() => setData(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setIsTodoDeleted(null));
  };

  const hasCompletedTodos = data.some(todo => todo.completed);

  const deleteCompletedTodos = () => {
    const completedIds = data
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return Promise.resolve();
    }

    setIsInputDisabled(true);
    setIsTodoDeleted(null);

    setIsTodoDeleted(null);

    return Promise.allSettled(
      completedIds.map(id => todoService.deleteTodos(id).then(() => id)),
    )
      .then(results => {
        const successIds = results
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<number>).value);

        const isSomeFailed = results.some(r => r.status === 'rejected');

        if (isSomeFailed) {
          showError('Unable to delete a todo');
        }

        setData(prev => prev.filter(todo => !successIds.includes(todo.id)));
      })
      .finally(() => {
        setIsInputDisabled(false);
        setIsTodoDeleted(null);
      });
  };

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return Promise.resolve();
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsTempTodo(tempTodo);
    setIsInputDisabled(true);

    return todoService
      .createTodos(newTodo)
      .then(todoFromServer => {
        setData(prev => [...prev, todoFromServer]);
      })
      .catch(er => {
        showError('Unable to add a todo');
        throw er;
      })
      .finally(() => {
        setIsTempTodo(null);
        setIsInputDisabled(false);
      });
  };

  return {
    data,
    errorMessage,
    isTempTodo,
    isInputDisabled,
    isTodoDeleted,
    hasCompletedTodos,
    setErrorMessage,
    deleteTodo,
    addTodo,
    deleteCompletedTodos,
  };
}
