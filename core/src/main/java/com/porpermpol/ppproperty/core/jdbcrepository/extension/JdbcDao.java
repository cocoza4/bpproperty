package com.porpermpol.ppproperty.core.jdbcrepository.extension;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcOperations;

import java.util.Iterator;

public abstract class JdbcDao {

    @Autowired
    protected JdbcOperations jdbcOperations;

    public static String sortingClauseIfRequired(Sort sort) {
        if(sort == null) {
            return "";
        } else {
            StringBuilder orderByClause = new StringBuilder();
            orderByClause.append(" ORDER BY ");
            Iterator iterator = sort.iterator();

            while(iterator.hasNext()) {
                Sort.Order order = (Sort.Order)iterator.next();
                orderByClause.append(order.getProperty()).append(" ").append(order.getDirection().toString());
                if(iterator.hasNext()) {
                    orderByClause.append(", ");
                }
            }

            return orderByClause.toString();
        }
    }

    public static String limitClause(Pageable page) {
        int offset = page.getPageNumber() * page.getPageSize();
        return " LIMIT " + page.getPageSize() + " OFFSET " + offset;
    }


}
