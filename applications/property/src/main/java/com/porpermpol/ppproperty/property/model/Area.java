package com.porpermpol.ppproperty.property.model;

public class Area {

    private Integer rai;
    private Integer yarn;
    private Integer tarangwa;

    public Area() {}

    public Area(Integer rai, Integer yarn, Integer tarangwa) {
        this.rai = rai;
        this.yarn = yarn;
        this.tarangwa = tarangwa;
    }

    public Integer getRai() {
        return rai;
    }

    public void setRai(Integer rai) {
        this.rai = rai;
    }

    public Integer getYarn() {
        return yarn;
    }

    public void setYarn(Integer yarn) {
        this.yarn = yarn;
    }

    public Integer getTarangwa() {
        return tarangwa;
    }

    public void setTarangwa(Integer tarangwa) {
        this.tarangwa = tarangwa;
    }
}
