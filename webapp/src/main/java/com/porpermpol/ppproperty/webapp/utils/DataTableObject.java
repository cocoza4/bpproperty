package com.porpermpol.ppproperty.webapp.utils;

import java.util.List;

public class DataTableObject<T> {

    private long totalRecords;
    private long totalDisplayRecords;
    private List<T> content;

    public DataTableObject(List<T> content, long totalDisplayRecords, long totalRecords) {
        this.content = content;
        this.totalDisplayRecords = totalDisplayRecords;
        this.totalRecords = totalRecords;
    }

    public long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public long getTotalDisplayRecords() {
        return totalDisplayRecords;
    }

    public void setTotalDisplayRecords(long totalDisplayRecords) {
        this.totalDisplayRecords = totalDisplayRecords;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }
}
