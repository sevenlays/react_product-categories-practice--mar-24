/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categor => product.categoryId === categor.id,
  );
  const user = usersFromServer.find(userId => userId.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

const copyProducts = [...products];

const SORT_PRODUCT = 'productname';
const SORT_CATEGORY = 'categoryname';
const SORT_USER = 'username';
const SORT_ID = 'id';
const SORT_DIRECTION_ASC = 'asc';
const SORT_DIRECTION_DESC = 'DESC';

export const App = () => {
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [sortByQuery, setSortByQuery] = useState('');
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION_ASC);

  function handleSortDirection() {
    setSortDirection(
      sortDirection === SORT_DIRECTION_ASC
        ? SORT_DIRECTION_DESC
        : SORT_DIRECTION_ASC,
    );
  }

  function getVisibleProducts(
    productsArr,
    owner,
    query,
    sortByKey,
    isReversed,
  ) {
    let visibleProducts = [...productsArr];

    if (owner !== 'All') {
      visibleProducts = visibleProducts.filter(
        product => product.user.name === owner,
      );
    }

    if (query) {
      visibleProducts = visibleProducts.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.user.name.toLowerCase().includes(query) ||
          product.category.title.toLowerCase().includes(query),
      );
    }

    if (sortByKey !== '') {
      visibleProducts.sort((product1, product2) => {
        switch (sortByKey) {
          case SORT_PRODUCT:
            return product1.name.localeCompare(product2.name);
          case SORT_CATEGORY:
            return product1.category.title.localeCompare(
              product2.category.title,
            );
          case SORT_USER:
            return product1.user.name.localeCompare(product2.user.name);
          case SORT_ID:
            return product1.id - product2.id;

          default:
            return 0;
        }
      });
    }

    if (isReversed === SORT_DIRECTION_ASC && sortByKey) {
      visibleProducts.reverse();
    }

    return visibleProducts;
  }

  const visibleProducts = getVisibleProducts(
    copyProducts,
    selectedOwner,
    sortByQuery,
    sortBy,
    sortDirection,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedOwner('All')}
                className={cn({ 'is-active': selectedOwner === 'All' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedOwner(user.name)}
                  className={cn({ 'is-active': selectedOwner === user.name })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={sortByQuery}
                  onChange={event => {
                    setSortByQuery(event.target.value.toLowerCase().trim());
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {sortByQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSortByQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {visibleProducts.length !== 0 && (
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_ID);
                          handleSortDirection();
                        }}
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_PRODUCT);
                          handleSortDirection();
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas fa-sort', {
                              'fa-sort-up':
                                sortBy === SORT_PRODUCT &&
                                sortDirection === SORT_DIRECTION_ASC,
                              'fa-sort-down':
                                sortBy === SORT_PRODUCT &&
                                sortDirection === SORT_DIRECTION_DESC,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_CATEGORY);
                          handleSortDirection();
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas fa-sort', {
                              'fa-sort-up':
                                sortBy === SORT_CATEGORY &&
                                sortDirection === SORT_DIRECTION_ASC,
                              'fa-sort-down':
                                sortBy === SORT_CATEGORY &&
                                sortDirection === SORT_DIRECTION_DESC,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a
                        href="#/"
                        onClick={() => {
                          setSortBy(SORT_USER);
                          handleSortDirection();
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas fa-sort', {
                              'fa-sort-up':
                                sortBy === SORT_USER &&
                                sortDirection === SORT_DIRECTION_ASC,
                              'fa-sort-down':
                                sortBy === SORT_USER &&
                                sortDirection === SORT_DIRECTION_DESC,
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            )}

            <tbody>
              {visibleProducts.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.category.icon} - {product.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={cn({
                      'has-text-link': product.user.sex === 'm',
                      'has-text-danger': product.user.sex === 'f',
                    })}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
